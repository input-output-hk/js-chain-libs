import * as Bip39 from 'bip39';

import wordlist from './wordlist.en';

const { bip39 } = Bip39;

export const isValidMnemonic = (mnemonicPhrase, numberOfWords = 12) => {
  return (
    mnemonicPhrase &&
    mnemonicPhrase.split(' ').length === numberOfWords &&
    Bip39.validateMnemonic(mnemonicPhrase, wordlist)
  );
};

export const fromMnemonic = (mnemonicPhrase, mnemonicPassword) => {
  const seed = Bip39.mnemonicToSeedSync(mnemonicPhrase, mnemonicPassword);
  return seed;
};

export const generateMnemonic = (ms: ?number = 12) => {
  let ent = 256;
  switch (ms) {
    case 9:
      ent = 96;
      break;
    case 15:
      ent = 160;
      break;
    case 18:
      ent = 192;
      break;
    case 21:
      ent = 224;
      break;
    case 24:
      ent = 256;
      break;
    default:
      ent = 128;
  }

  return bip39.generateMnemonic(ent, null, wordlist);
};
