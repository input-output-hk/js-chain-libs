export const SearchUrl = {
  BLOCK_BY_ID: 'block',
  BLOCK_BY_LENGTH: 'block/chainLength',
  TX: 'tx'
};

const isInt = searchValue => {
  const parsed = parseInt(searchValue, 10);
  return !isNaN(parsed);
};

// TODO: replace with real search value checking
// Only for testing purposes right now
export const getSearchUrl = searchValue => {
  if (isInt(searchValue)) {
    return SearchUrl.BLOCK_BY_LENGTH;
  }
  switch (searchValue[0]) {
    case 'b':
      return SearchUrl.BLOCK_BY_ID;
    case 't':
      return SearchUrl.TX;
    default:
      return null;
  }
};
