// @flow
export const uint8ArrayToHexString = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const hexStringToUint8Array = (hexString: string): Uint8Array => {
  if (hexString.length % 2) {
    throw new Error(
      `The string ${hexString} is of odd length, and cannot be parsed to a Uint8Array`
    );
  }
  if (!hexString.match(/[a-f0-9]/gi)) {
    throw new Error(
      `The string ${hexString} has invalid characters, and cannot be parsed to a Uint8Array`
    );
  }
  return new Uint8Array(
    hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  );
};
