// @flow
// eslint-disable-next-line import/prefer-default-export
export const uint8ArrayToHexString = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
