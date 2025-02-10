import ecc from 'tiny-secp256k1'
import wif from 'wif'
import BN from 'bn.js'
import { ec } from 'elliptic'
import * as bitcoin from 'bitcoinjs-lib'

export class BitcoinSigner {
  constructor(privString) {
    const decoded = wif.decode(privString);
    if (!ecc.isPrivate(decoded.privateKey)) throw new TypeError('Private key not in range [1, n)');
    this.privateKey = decoded.privateKey;
    this.publicKey = ecc.pointFromScalar(this.privateKey, decoded.compressed);
  }

  sign(payload, simpleSign = false) {
    if (!this.privateKey) throw new Error('Missing private key');
    let sig = ecc.sign(payload, this.privateKey);

    if (simpleSign) {
      return sig;
    }

    const extraData = Buffer.alloc(32, 0);
    let counter = 0;
    while (sig[0] > 0x7f) {
      counter++;
      extraData.writeUIntLE(counter, 0, 6);
      sig = ecc.signWithEntropy(payload, this.privateKey, extraData);
    }
    return sig;
  }

  verify(payload, signature) {
    return ecc.verify(payload, this.publicKey, signature);
  }

  compressed() {
    return true;
  }

  toMessageSigner() {
    const privString = wif.encode(128, this.privateKey, true);
    return new BitcoinMessageSigner(privString);
  }

  signMessageForRango(message) {
    const prefix = Buffer.from('\x18Bitcoin Signed Message:\n', 'utf8');
    const messageBuffer = Buffer.from(message);
    const payload = bitcoin.crypto.sha256(bitcoin.crypto.sha256(
      Buffer.concat([prefix, Buffer.from(String(messageBuffer.length), 'utf8'), messageBuffer])
    ));
    
    const { signature, recovery } = this.toMessageSigner().sign(payload);
    return Buffer.concat([
      signature,
      Buffer.from([recovery + 27 + 4]) // Rango-specific recovery format
    ]).toString('base64');
  }
}

class BitcoinMessageSigner extends BitcoinSigner {
  sign(payload) {
    const signature = super.sign(payload, true);
    const recovery = this.recidFromSig(payload, this.publicKey, signature);
    return {
      signature,
      recovery,
    };
  }

  recidFromSig(payload, publicKey, signature) {
    const secp256k1 = new ec('secp256k1');
    const n = secp256k1.curve.n;
    const G = secp256k1.curve.g;
    const Q = secp256k1.curve.decodePoint(publicKey);
    const r = new BN(signature.slice(0, 32));
    const s = new BN(signature.slice(32, 64));
    const e = new BN(payload);
    const sInv = s.invm(n);
    const u1 = e.mul(sInv).umod(n);
    const u2 = r.mul(sInv).umod(n);
    const R = G.mulAdd(u1, Q, u2);
    const isOddY = R.y.isOdd();
    const isHighX = R.x.cmp(n) >= 0 === true ? 1 : 0;
    const recid = (isHighX << 1) | (isOddY << 0);
    return recid;
  }

  verifyRangoSignature(message, signature) {
    const decoded = Buffer.from(signature, 'base64');
    const sig = decoded.slice(0, 64);
    const recovery = decoded[64] - 27 - 4;
    
    const prefix = Buffer.from('\x18Bitcoin Signed Message:\n', 'utf8');
    const messageBuffer = Buffer.from(message);
    const payload = bitcoin.crypto.sha256(bitcoin.crypto.sha256(
      Buffer.concat([prefix, Buffer.from(String(messageBuffer.length), 'utf8'), messageBuffer])
    ));

    return this.verify(payload, sig, recovery);
  }
}
