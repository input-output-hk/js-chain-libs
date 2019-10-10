// For now, if the value consists of numbers we consider it a possible blockNumber
// as the probability of a hash being formed only by numbers is pretty low
export const isBlockNumber = searchValue => {
  return /^\d+$/.test(searchValue);
};

export const blocksFromBlockConnection = connection => {
  return connection.edges.map(edge => edge.node);
};

// This function will only return the chainLengths
// not the full block objects
export const getNextPrev = block => {
  const prev = havePrevious(block) && Number(block.chainLength) - 1;
  const next = haveNext(block) && Number(block.chainLength) + 1;

  return { prev, next };
};

// FIXME: should have some logic to really know if
// there are next epoch or not.
export const haveNext = block => {
  return true;
};

export const havePrevious = block => {
  return block.chainLength !== '0';
};
