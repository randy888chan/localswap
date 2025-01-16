import { decrypt } from 'eciesjs'

export const decryptMessageWithAccountKey = (encryptedMessage, accountKey) => {
  if (!accountKey) {
    throw new Error('Account key is required');
  }
  // Preperation of private key from accountKey
  const privateKey = Buffer.from(accountKey, 'hex')
  const encryptedMessageBytes = Buffer.from(encryptedMessage, 'hex')
  const decryptedMessage = decrypt(privateKey, encryptedMessageBytes)
  return decryptedMessage.toString('utf8')
}
