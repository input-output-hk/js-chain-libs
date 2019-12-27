// @flow
import type { NodeSettings } from '../reducers/types';

const calculateFee = (nodeSettings: NodeSettings) => (
  inputsCount: number,
  outputsCount: number,
  certsCount: number
): number => {
  // Fee (#inputs + #outputs) * coefficient + #certificates*certificate + constant
  const ioFee = (inputsCount + outputsCount) * nodeSettings.fees.coefficient;
  const certFee = certsCount * nodeSettings.fees.certificate;

  return ioFee + certFee + nodeSettings.fees.constant;
};

export default (nodeSettings: NodeSettings) => ({
  calculateFee: calculateFee(nodeSettings),
  sendFundsFee: () => calculateFee(nodeSettings)(1, 1, 0)
});
