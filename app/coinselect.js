const { address } = require('bitcoinjs-lib');
const { keccak256 } = require('ethereumjs-util');
const { utils } = require('ethers');

export function validateLcsTransaction(txHex, expectedOutputs) {
  const tx = bitcoin.Transaction.fromHex(txHex);
  let totalOutput = 0;

  // Validate outputs match expected structure
  const outputValidation = tx.outs.map((out, index) => {
    const script = bitcoin.script.decompile(out.script);
    const address = bitcoin.address.fromOutputScript(out.script);
    const expected = expectedOutputs[index];

    if (!expected) return false;
    
    return address === expected.address && 
           out.value >= expected.minValue &&
           (!expected.script || bitcoin.script.toASM(script) === expected.script);
  });

  // Sum all output values
  totalOutput = tx.outs.reduce((sum, out) => sum + out.value, 0);

  return {
    valid: outputValidation.every(v => v),
    totalOutput,
    fee: tx.getFee() // Only valid if we have inputs values
  };
}

export async function signMultiSigTransaction(psbt, accountKey, tradeSecret) {
  if (!accountKey || !tradeSecret) {
    throw new Error('Credentials required for signing');
  }

  const decryptedSecret = decryptMessageWithAccountKey(tradeSecret, accountKey);
  const keyPair = BitcoinSigner.fromAccountKey(accountKey);

  psbt.data.inputs.forEach((input, index) => {
    if (input.redeemScript) {
      const witnessScript = deriveWitnessScript(decryptedSecret);
      psbt.finalizeInput(index, (_, input, script) => { 
        return finaliseTradeInput({
          secret: decryptedSecret,
          instruction: input.tradeInstruction
        })(input.index, input, script);
      });
    } else {
      psbt.signInput(index, keyPair);
    }
  });

  return psbt;
}

export async function verifyMessageSignature(
  message, 
  signature, 
  expectedAddress
) {
  try {
    const publicKey = secp.recoverPublicKey(
      keccak256(utils.toUtf8Bytes(message)), 
      signature.slice(0, 64), 
      parseInt(signature.slice(64))
    );
    
    const recoveredAddress = utils.computeAddress(publicKey);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    return false;
  }
}

export function validateAddressOwnership(
  address,
  signedChallenge,
  originalChallenge
) {
  const validSig = verifyMessageSignature(originalChallenge, signedChallenge, address);
  
  if (!validSig) {
    throw new Error('Invalid address ownership proof');
  }
  
  return true;
}

const TX_EMPTY_VIRTUAL_SIZE = ((4 + 4 + 1 + 1) * 4 + 1 + 1) / 4;

const TX_OUTPUT_BASE = 8 + 1;

const BLANK_OUTPUT_VBYTES = 32;

const TX_INPUT_BASE = 32 + 4 + 1 + 4;

const TX_TRADE_RELEASE_WITNESS_BYTES = 341;
const TX_STANDARD_P2SH_P2WPKH_WITNESS_BYTES = 108;
const TX_REF_P2SH_SEGWIT_STRIPPED = 35;

const TX_STANDARD_P2SH_SEGWIT_STRIPPED = 23;

const byteLength = (hexString) => hexString.length / 2;

function inputVirtualBytes(input) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  let p2sh_stripped_base = TX_INPUT_BASE;
  let witnessBytes;
  if (input.tradeInstruction) {
    p2sh_stripped_base += TX_REF_P2SH_SEGWIT_STRIPPED;
    witnessBytes = TX_TRADE_RELEASE_WITNESS_BYTES;
  } else {
    p2sh_stripped_base += TX_STANDARD_P2SH_SEGWIT_STRIPPED;
    witnessBytes = TX_STANDARD_P2SH_P2WPKH_WITNESS_BYTES;
  }
  return (p2sh_stripped_base * 4 + witnessBytes) / 4;
}

function outputVirtualBytes(output) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  const outputScript = address.toOutputScript(output.address).toString('hex');
  return TX_OUTPUT_BASE + byteLength(outputScript);
}

function transactionVirtualBytes(inputs, outputs) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  return (
    TX_EMPTY_VIRTUAL_SIZE +
    inputs.reduce((a, x) => a + inputVirtualBytes(x), 0) +
    outputs.reduce((a, x) => a + outputVirtualBytes(x), 0)
  );
}

function dustThreshold(output, feeRate) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  return Math.ceil(inputVirtualBytes({}) * feeRate);
}

function uintOrNaN(v) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  if (!isFinite(v)) return NaN;
  if (v < 0) return NaN;
  return v;
}

function sumForgiving(range) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  return range.reduce((a, x) => a + (isFinite(x.value) ? x.value : 0), 0);
}

function sumOrNaN(range) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  return range.reduce((a, x) => a + uintOrNaN(x.value), 0);
}

function finalize(inputs, outputs, feeRate) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  const bytesAccum = transactionVirtualBytes(inputs, outputs);
  const feeAfterExtraOutput = feeRate * (bytesAccum + BLANK_OUTPUT_VBYTES);
  const remainderAfterExtraOutput =
    sumOrNaN(inputs) - (sumOrNaN(outputs) + feeAfterExtraOutput);

  if (remainderAfterExtraOutput > dustThreshold({}, feeRate)) {
    outputs = outputs.concat({ value: remainderAfterExtraOutput });
  }

  const fee = sumOrNaN(inputs) - sumOrNaN(outputs);
  if (!isFinite(fee)) {
    return {
      fee: feeRate * bytesAccum,
      outputs: undefined,
      inputs: undefined,
    };
  }

  return {
    inputs,
    outputs,
    fee,
  };
}

function blackjack(utxos, outputs, feeRate) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  if (!isFinite(uintOrNaN(feeRate))) {
    return {
      inputs: undefined,
      outputs: undefined,
      fee: undefined,
    };
  }

  let bytesAccum = transactionVirtualBytes([], outputs);

  let inAccum = 0;
  const inputs = [];
  const outAccum = sumOrNaN(outputs);
  const threshold = dustThreshold({}, feeRate);

  for (let i = 0; i < utxos.length; i += 1) {
    const input = utxos[i];
    const iBytes = inputVirtualBytes(input);
    const fee = feeRate * (bytesAccum + iBytes);
    const inputValue = uintOrNaN(input.value);

    if (inAccum + inputValue > outAccum + fee + threshold) continue;

    bytesAccum += iBytes;
    inAccum += inputValue;
    inputs.push(input);

    if (inAccum < outAccum + fee) continue;

    return finalize(inputs, outputs, feeRate);
  }
  return {
    fee: feeRate * bytesAccum,
    inputs: undefined,
    outputs: undefined,
  };
}

function accumulative(utxos, outputs, feeRate) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  if (!isFinite(uintOrNaN(feeRate))) {
    return {
      inputs: undefined,
      outputs: undefined,
      fee: undefined,
    };
  }
  let bytesAccum = transactionVirtualBytes([], outputs);

  let inAccum = 0;
  const inputs = [];
  const outAccum = sumOrNaN(outputs);

  for (let i = 0; i < utxos.length; i += 1) {
    const utxo = utxos[i];
    const utxoBytes = inputVirtualBytes(utxo);
    const utxoFee = feeRate * utxoBytes;
    const utxoValue = uintOrNaN(utxo.value);

    if (utxoFee > utxo.value) {
      if (i === utxos.length - 1)
        return {
          fee: feeRate * (bytesAccum + utxoBytes),
          inputs: undefined,
          outputs: undefined,
        };
      continue;
    }

    bytesAccum += utxoBytes;
    inAccum += utxoValue;
    inputs.push(utxo);

    const fee = feeRate * bytesAccum;

    if (inAccum < outAccum + fee) continue;

    return finalize(inputs, outputs, feeRate);
  }
  return {
    fee: feeRate * bytesAccum,
    inputs: undefined,
    outputs: undefined,
  };
}

function split(utxos, outputs, feeRate) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  if (!isFinite(uintOrNaN(feeRate))) {
    return {
      inputs: undefined,
      outputs: undefined,
      fee: undefined,
    };
  }

  const bytesAccum = transactionVirtualBytes(utxos, outputs);
  const fee = feeRate * bytesAccum;
  if (outputs.length === 0) {
    return {
      fee,
      inputs: undefined,
      outputs: undefined,
    };
  }

  const inAccum = sumOrNaN(utxos);
  const outAccum = sumForgiving(outputs);
  const remaining = inAccum - outAccum - fee - 1;
  if (!isFinite(remaining) || remaining < 0) {
    return {
      inputs: 'notEnoughForFee',
      outputs: null,
      fee: fee / 10,
    };
  }

  const unspecified = outputs.reduce((a, x) => a + !isFinite(x.value), 0);

  if (remaining === 0 && unspecified === 0) {
    return finalize(utxos, outputs, feeRate);
  }

  const splitOutputsCount = outputs.reduce((a, x) => a + !x.value, 0);
  const splitValue = Math.ceil(remaining / splitOutputsCount);

  if (
    !outputs.every(
      (x) => x.value !== undefined || splitValue > dustThreshold(x, feeRate)
    )
  ) {
    return {
      fee,
      inputs: undefined,
      outputs: undefined,
    };
  }

  const returnOutputs = outputs.map((x) => {
    if (x.value !== undefined) return x;

    const y = {};
    for (const k in x) y[k] = x[k];
    y['value'] = splitValue;
    return y;
  });
  return finalize(utxos, returnOutputs, feeRate);
}

function utxoScore(x, feeRate) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  return x.value - feeRate * inputVirtualBytes(x);
}

function coinSelect(utxos, outputs, feeRate) {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  utxos = utxos.concat().sort((a, b) => utxoScore(b, feeRate) - utxoScore(a, feeRate));

  const base = blackjack(utxos, outputs, feeRate);
  if (base['inputs']) return base;

  return accumulative(utxos, outputs, feeRate);
}

module.exports = {
  coinSelect,
  split
};
