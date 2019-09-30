import React from 'react';
import { Router } from '@reach/router';
import TransactionSearchResult from '../TransactionSearchResult/TransactionSearchResult';
import BlockSearchResult from '../BlockSearchResult/BlockSearchResult';
import BlockByLengthSearchResult from '../BlockByLengthSearchResult/BlockByLengthSearchResult';

const SearchResult = () => (
  <Router>
    <BlockSearchResult path="block/:id" />
    <TransactionSearchResult path="tx/:id" />
    <BlockByLengthSearchResult path="block/chainLength/:length" />
  </Router>
);

export default SearchResult;
