import React from 'react';
import { Router } from '@reach/router';
import Container from 'react-bootstrap/Container';

import Search from './components/Search/Search';
import MainNavbar from './components/MainNavbar/MainNavbar';
import RecentBlocks from './components/RecentBlocks/RecentBlocks';

import StatusWrapper from './components/Status/StatusWrapper';
import TransactionSearchResult from './components/TransactionSearchResult/TransactionSearchResult';
import BlockSearchResult from './components/BlockSearchResult/BlockSearchResult';
import CertificateSearchResult from './components/CertificateSearchResult/CertificateSearchResult';

import './App.css';

const App = () => (
  <Container fluid>
    <MainNavbar />
    <Container fluid>
      <StatusWrapper />
      <Search />
      <Router>
        <BlockSearchResult path="block/:id" />
        <TransactionSearchResult path="tx/:id" />
        <CertificateSearchResult path="cert/:id" />
        <RecentBlocks path="/" />
      </Router>
    </Container>
  </Container>
);

export default App;
