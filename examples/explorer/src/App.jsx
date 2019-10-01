import React from 'react';
import { Router } from '@reach/router';
import Container from 'react-bootstrap/Container';

import SearchBar from './components/Search/SearchBar/SearchBar';
import MainNavbar from './components/MainNavbar/MainNavbar';
import RecentBlocks from './components/Blocks/RecentBlocks/RecentBlocks';

import StatusBar from './components/Status/StatusBar/StatusBar';
import TransactionSearchResult from './components/Search/TransactionSearchResult/TransactionSearchResult';
import BlockSearchResult from './components/Search/BlockSearchResult/BlockSearchResult';
import BlockByLengthSearchResult from './components/Search/BlockByLengthSearchResult/BlockByLengthSearchResult';

import './App.css';

const App = () => (
  <Container fluid>
    <MainNavbar />
    <Container fluid>
      {/* <StatusBar /> */}
      <SearchBar />
      <Router>
        <BlockSearchResult path="block/:id" />
        <TransactionSearchResult path="tx/:id" />
        <BlockByLengthSearchResult path="block/chainLength/:length" />
        <RecentBlocks path="/" />
      </Router>
    </Container>
  </Container>
);

export default App;
