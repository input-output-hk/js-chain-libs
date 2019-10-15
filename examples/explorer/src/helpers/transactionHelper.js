import Big from 'big.js';
import { assuranceLevels } from '../config.json';
import { ASSURANCE } from './constants';

// Sum all inputs/outputs amount
const getTotal = utxos =>
  utxos.reduce(
    (accum, utxo) =>
      Big(accum)
        .add(Big(utxo.amount))
        .toFixed(),
    0
  );

const txAssuranceLevel = confirmations => {
  const { low, medium, high } = assuranceLevels;
  if (confirmations > high) {
    return ASSURANCE.high;
  }
  if (confirmations > medium) {
    return ASSURANCE.medium;
  }
  if (confirmations > low) {
    return ASSURANCE.low;
  }

  return ASSURANCE.unconfirmed;
};

const txConfirmations = (tx, status) => {
  return (
    Number.parseInt(status.latestBlock.chainLength, 10) - Number.parseInt(tx.block.chainLength, 10)
  );
};

export const inputsAmount = tx => getTotal(tx.inputs);
export const outputsAmount = tx => getTotal(tx.outputs);
/**
 *
 * @param tx A transaction object, with a block property.
 * @param status A status object with a latestBlock property.
 * @return {confirmations, assuranceLevel}
 */
export const getConfirmations = (tx, status) => {
  const confirmations = txConfirmations(tx, status);
  const assuranceLevel = txAssuranceLevel(confirmations);

  return { confirmations, assuranceLevel };
};
