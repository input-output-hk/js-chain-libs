// For now, if the value is an Integer it could be a blockNumber
export const isBlockNumber = searchValue => {
  const parsed = Number.parseInt(searchValue, 10);
  return !Number.isNaN(parsed);
};
