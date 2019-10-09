import React from 'react';
import { Router } from '@reach/router';

import SearchBar from './components/Search/SearchBar/SearchBar';
import MainNavbar from './components/MainNavbar/MainNavbar';
import RecentBlocks from './components/Blocks/RecentBlocks/RecentBlocks';

import StatusBar from './components/Status/StatusBar/StatusBar';
import MainSection from './components/MainSection/MainSection';
import TransactionSearchResult from './components/Search/TransactionSearchResult/TransactionSearchResult';
import BlockSearchResult from './components/Search/BlockSearchResult/BlockSearchResult';
import EpochSearchResult from './components/Search/EpochSearchResult/EpochSearchResult';
import BlockByLengthSearchResult from './components/Search/BlockByLengthSearchResult/BlockByLengthSearchResult';
import AddressSearchResult from './components/Search/AddressSearchResult/AddressSearchResult';
import EmptyResult from './components/Commons/EmptyResult/EmptyResult';

import './generalStyling.scss';

const App = () => (
  <div>
    <MainNavbar />
    <div>
      {/* <StatusBar /> */}
      <SearchBar />
      <MainSection>
        <Router id="router">
          <EmptyResult default />
          <EpochSearchResult path="epoch/:id" />
          <AddressSearchResult path="address/:bech32" />
          <TransactionSearchResult path="tx/:id" />
          <BlockSearchResult path="block/:id" />
          <BlockByLengthSearchResult path="block/chainLength/:length" />
          <RecentBlocks path="/" />
        </Router>
      </MainSection>
    </div>
  </div>
);

export default App;
