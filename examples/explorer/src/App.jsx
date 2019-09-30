import React from 'react';
import { Router } from '@reach/router';
import Container from 'react-bootstrap/Container';

import Search from './components/Search/Search';
import MainNavbar from './components/MainNavbar/MainNavbar';
import RecentBlocks from './components/RecentBlocks/RecentBlocks';

import StatusBar from './components/StatusBar/StatusBar';
import TransactionSearchResult from './components/TransactionSearchResult/TransactionSearchResult';
import BlockSearchResult from './components/BlockSearchResult/BlockSearchResult';
import BlockByLengthSearchResult from './components/BlockByLengthSearchResult/BlockByLengthSearchResult';

import './App.css';

const App = () => (
  <Container fluid>
    <MainNavbar />
    <Container fluid>
      {/* <StatusBar /> */}
      <Search />
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
