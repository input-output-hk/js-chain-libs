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

/**
 * Returns the amount in inputs of the transaction
 * @param tx A transaction object, with an array
 * of inputs and an array of outputs
 * @return Total inputs amount
 */
export const inputsAmount = tx => getTotal(tx.inputs);

/**
 * Returns the amount in outputs of the transaction
 * @param tx A transaction object, with an array
 * of inputs and an array of outputs
 * @return Total outputs amount
 */
export const outputsAmount = tx => getTotal(tx.outputs);

/**
 * Returns the amount in fees of the transaction
 * @param tx A transaction object, with an array
 * of inputs and an array of outputs
 * @return Total transaction fees
 */
export const feesAmount = tx => {
  const outputs = outputsAmount(tx);
  const inputs = inputsAmount(tx);

  // Genesis block have no inputs
  return Math.max(inputs - outputs, 0);
};

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
