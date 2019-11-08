import bip39 from 'bip39';

const validWords = bip39.wordlists.english;

export const isValidMnemonic = (mnemonicPhrase, numberOfWords = 18) => {
  console.log('*** fromMnemonic mnemonicPhrase: '.concat(mnemonicPhrase));
  return (
    mnemonicPhrase.split(' ').length === numberOfWords &&
    bip39.validateMnemonic(mnemonicPhrase, validWords)
  );
};

export const fromMnemonic = mnemonicPhrase => {
  console.log('*** fromMnemonic mnemonicPhrase: '.concat(mnemonicPhrase));
  bip39.mnemonicToEntropy(mnemonicPhrase, validWords);
};

export const generateMnemonic = (ms: ?number = 18) => {
  let ent = 192;
  switch (ms) {
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
      ent = 192;
  }

  return bip39.generateMnemonic(ent, null, validWords);
};
