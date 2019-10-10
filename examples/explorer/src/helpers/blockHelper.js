// For now, if the value consists of numbers we consider it a possible blockNumber
// as the probability of a hash being formed only by numbers is pretty low
export const isBlockNumber = searchValue => {
  return /^\d+$/.test(searchValue);
};
