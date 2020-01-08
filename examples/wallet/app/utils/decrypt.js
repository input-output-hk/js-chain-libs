/* eslint-disable new-cap */
import aesjs from 'aes-js';
import blakejs from 'blakejs';

const blake2b = data => blakejs.blake2b(data, null, 32);
const SECRET = 'wallet_demo#';
const AES_SECRET = ':aes_secret#';

export function aesEncrypt(unlockWalletPassword: string, text: string): string {
  const aesPasswordText = unlockWalletPassword
    .concat(SECRET)
    .concat(AES_SECRET);
  const aesKey = blake2b(aesPasswordText);
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(aesjs.utils.utf8.toBytes(text));
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

export function aesDecrypt(
  unlockWalletPassword: string,
  encryptedHex: string
): string {
  const aesPasswordText = unlockWalletPassword
    .concat(SECRET)
    .concat(AES_SECRET);
  const aesKey = blake2b(aesPasswordText);
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5));
  const decryptedBytes = aesCtr.decrypt(aesjs.utils.hex.toBytes(encryptedHex));
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}
