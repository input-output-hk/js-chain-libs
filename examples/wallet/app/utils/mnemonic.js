import { validateMnemonic, mnemonicToSeedSync } from 'bip39';

import wordlist from './wordlist.en';

export const isValidMnemonic = (mnemonicPhrase: string, numberOfWords = 12) => {
  return (
    mnemonicPhrase &&
    mnemonicPhrase.split(' ').length === numberOfWords &&
    validateMnemonic(mnemonicPhrase, wordlist)
  );
};

export const createSeedFromMnemonic = (
  mnemonicPhrase: string,
  mnemonicPassword?: string
) => {
  const password = mnemonicPassword || '';
  const seed = mnemonicToSeedSync(mnemonicPhrase, password);
  return seed;
};
