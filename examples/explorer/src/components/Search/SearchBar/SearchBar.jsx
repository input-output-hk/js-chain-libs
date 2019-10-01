import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import './searchBar.scss';
import { getSearchUrl } from '../../../helpers/searchHelper';

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

const Search = () => {
  const [searchValue, setSearchValue] = useState(0);

  return (
    <Jumbotron>
      <div className="searchContainer">
        <h1 className="header"> Search for transactions or blocks </h1>
        <div className="searchForm">
          <Form.Control
            type="text"
            onChange={event => setSearchValue(event.target.value)}
            placeholder="Search for block, transaction or certificate id ..."
          />
          <ButtonGroup>
            <Button variant="primary" onClick={() => onBlockSearchClick(searchValue)}>
              Block
            </Button>
            <Button variant="primary" onClick={() => onTxSearchClick(searchValue)}>
              Transaction
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Jumbotron>
  );
};

export default Search;
