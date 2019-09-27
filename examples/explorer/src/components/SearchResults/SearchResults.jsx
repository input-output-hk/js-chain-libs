import React from 'react';
import TransactionSearchResult from '../TransactionSearchResult/TransactionSearchResult';
import BlockSearchResult from '../BlockSearchResult/BlockSearchResult';

/** From now we only support search for ids */
const SearchResults = ({ type, id }) => {
  switch (type) {
    case 'BLOCK':
      return <BlockSearchResult {...{ id }} />;
    case 'TRANSACTION':
      return <TransactionSearchResult {...{ id }} />;
    default:
      return <h1> No results...</h1>;
  }
};

export default SearchResults;
