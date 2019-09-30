// Sum all inputs/outputs amount
const getTotal = utxos => utxos.reduce((accum, utxo) => accum + utxo.amount);

export const inputsAmount = tx => getTotal(tx.inputs);
export const outputsAmount = tx => getTotal(tx.outputs);
