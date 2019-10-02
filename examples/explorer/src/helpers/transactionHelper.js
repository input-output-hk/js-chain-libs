import Big from 'big.js';

// Sum all inputs/outputs amount
const getTotal = utxos =>
  utxos.reduce(
    (accum, utxo) =>
      Big(accum)
        .add(Big(utxo.amount))
        .toFixed(),
    0
  );

export const inputsAmount = tx => getTotal(tx.inputs);
export const outputsAmount = tx => getTotal(tx.outputs);
