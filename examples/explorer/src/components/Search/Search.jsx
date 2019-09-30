import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './search.scss';
import { getSearchUrl } from '../../helpers/searchHelper';

const onSearchClick = searchValue => {
  const baseUrl = getSearchUrl(searchValue);
  if (!baseUrl) {
    // TODO: Handle this in a proper way
    alert('Do something prettier');
    return;
  }
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
            placeholder="Search for transaction, block or certificate id ..."
          />
          <Button variant="primary" onClick={() => onSearchClick(searchValue)}>
            {' '}
            Search{' '}
          </Button>
        </div>
      </div>
    </Jumbotron>
  );
};

export default Search;
