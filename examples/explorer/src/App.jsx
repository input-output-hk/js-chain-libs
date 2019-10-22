import React from 'react';
import { Router } from '@reach/router';
import { MainSection, MainNavbar, SearchBar } from './components/General';
import { EmptyResult } from './components/Commons';

import {
  RecentBlocks,
  TransactionSearchResult,
  BlockSearchResult,
  EpochSearchResult,
  BlockByLengthSearchResult,
  AddressSearchResult,
  StakePoolSearchResult
} from './components/MainSection';

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
          <StakePoolSearchResult path="pool/:id" />
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
