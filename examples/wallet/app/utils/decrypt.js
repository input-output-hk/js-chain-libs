import aesjs from 'aes-js';
import blakejs from 'blakejs';

const blake2b = data => blakejs.blake2b(data, null, 32);
const blake2bHex = data => blakejs.blake2bHex(data, null, 32);
const SECRET = 'wallet_demo#';
const AES_SECRET = ':aes_secret#';

export function computeBlake2bHexWithSecret(spendingPassword: string): string {
  const fullSpendingPassword = spendingPassword.concat(SECRET);
  return blake2bHex(fullSpendingPassword);
}

export function isBlake2HashHexWithSecretOk(
  spendingPassword: string,
  blake2bHashHex: string
): boolean {
  const fullSpendingPassword = spendingPassword.concat(SECRET);
  return blake2bHex(fullSpendingPassword) === blake2bHashHex;
}

export function aesEncrypt(spendingPassword: string, text: string): string {
  const aesPasswordText = spendingPassword.concat(SECRET).concat(AES_SECRET);
  const aesKey = blake2b(aesPasswordText);
  // eslint-disable-next-line new-cap
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(aesjs.utils.utf8.toBytes(text));
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

export function aesDecrypt(
  spendingPassword: string,
  encryptedHex: string
): string {
  const aesPasswordText = spendingPassword.concat(SECRET).concat(AES_SECRET);
  const aesKey = blake2b(aesPasswordText);
  // eslint-disable-next-line new-cap
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(5));
  const decryptedBytes = aesCtr.decrypt(aesjs.utils.hex.toBytes(encryptedHex));
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}
