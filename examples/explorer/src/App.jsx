import React from 'react';
import Container from 'react-bootstrap/Container';

import Search from './components/Search/Search';
import MainNavbar from './components/MainNavbar/MainNavbar';
import RecentBlocks from './components/RecentBlocks/RecentBlocks';

import StatusWrapper from './components/Status/StatusWrapper';
import SearchResults from './components/SearchResults/SearchResults';

import './App.css';

const App = () => (
  <Container fluid>
    <MainNavbar />
    <Container fluid>
      <StatusWrapper />
      <Search />
      <SearchResults />
      <RecentBlocks />
    </Container>
  </Container>
);

export default App;
