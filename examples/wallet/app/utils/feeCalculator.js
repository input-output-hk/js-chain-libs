// @flow

const calculateFee = (nodeSettings: NodeSettings) => (
  inputsCount: number,
  outputsCount: number,
  certsCount: number
) => {
  // Fee (#inputs + #outputs) * coefficient + #certificates*certificate + constant
  const ioFee = (inputsCount + outputsCount) * nodeSettings.fees.coefficient;
  const certFee = certsCount * nodeSettings.fees.certificate;

  return ioFee + certFee + nodeSettings.fees.constant;
};

export default (nodeSettings: NodeSettings) => ({
  calculateFee: calculateFee(nodeSettings)
});
