export const SearchType = {
  BLOCK: 'block',
  TX: 'tx',
  CERT: 'cert',
  UNKNOWN: 'unknown'
};

// TODO: replace with real search value checking
// Only for testing purposes right now
export const getSearchType = searchValue => {
  switch (searchValue[0]) {
    case 'b':
      return SearchType.BLOCK;
    case 'c':
      return SearchType.CERT;
    case 't':
      return SearchType.TX;
    default:
      return SearchType.UNKNOWN;
  }
};
