import * as Bip39 from 'bip39';

import wordlist from './wordlist.en';

const { bip39 } = Bip39;

export const isValidMnemonic = (mnemonicPhrase, numberOfWords = 24) => {
  console.log('*** fromMnemonic mnemonicPhrase: '.concat(mnemonicPhrase));
  return (
    mnemonicPhrase &&
    mnemonicPhrase.split(' ').length === numberOfWords &&
    Bip39.validateMnemonic(mnemonicPhrase, wordlist)
  );
};

export const fromMnemonic = mnemonicPhrase => {
  console.log('*** fromMnemonic mnemonicPhrase: '.concat(mnemonicPhrase));
  Bip39.mnemonicToEntropy(mnemonicPhrase, wordlist);
};

export const generateMnemonic = (ms: ?number = 24) => {
  let ent = 256;
  switch (ms) {
    case 24:
      ent = 256;
      break;
    default:
      ent = 256;
  }

  return bip39.generateMnemonic(ent, null, wordlist);
};
