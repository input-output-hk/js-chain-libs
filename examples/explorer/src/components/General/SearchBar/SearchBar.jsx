import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import './searchBar.scss';
import { isBlockNumber } from '../../../helpers/blockHelper';

const onStakePoolSearchClick = searchValue => {
  const baseUrl = 'pool';

  navigate(`/${baseUrl}/${searchValue}`);
};

const onEpochSearchClick = searchValue => {
  const baseUrl = 'epoch';

  navigate(`/${baseUrl}/${searchValue}`);
};

const onBlockSearchClick = searchValue => {
  let baseUrl = 'block';

  if (isBlockNumber(searchValue)) {
    baseUrl = 'block/chainLength';
  }

  navigate(`/${baseUrl}/${searchValue}`);
};

const onTxSearchClick = searchValue => {
  const baseUrl = 'tx';
  navigate(`/${baseUrl}/${searchValue}`);
};

const onAddressSearchClick = searchValue => {
  const baseUrl = 'address';
  navigate(`/${baseUrl}/${searchValue}`);
};

const Search = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <Jumbotron>
      <div className="searchContainer">
        <h1> Jörmungandr blockchain search </h1>
        <div className="searchForm">
          <Form.Control
            type="text"
            onChange={event => setSearchValue(event.target.value)}
            placeholder="Search by epoch number, block hash, chain length, stake pool id, transaction hash or address..."
          />
          <DropdownButton id="dropdown-basic-button" title="Search">
            <Dropdown.Item variant="primary" onClick={() => onEpochSearchClick(searchValue)}>
              Epoch
            </Dropdown.Item>
            <Dropdown.Item variant="primary" onClick={() => onBlockSearchClick(searchValue)}>
              Block
            </Dropdown.Item>
            <Dropdown.Item variant="primary" onClick={() => onTxSearchClick(searchValue)}>
              Transaction
            </Dropdown.Item>
            <Dropdown.Item variant="primary" onClick={() => onAddressSearchClick(searchValue)}>
              Address
            </Dropdown.Item>
            <Dropdown.Item variant="primary" onClick={() => onStakePoolSearchClick(searchValue)}>
              Stake pool
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    </Jumbotron>
  );
};

export default Search;
