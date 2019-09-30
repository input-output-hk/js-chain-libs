import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './search.scss';
import { SearchType, getSearchType } from '../../helpers/searchHelper';

const onSearchClick = searchValue => {
  const type = getSearchType(searchValue);
  if (type === SearchType.UNKNOWN) {
    alert('Do something prettier');
    return;
  }
  navigate(`/${type}/${searchValue}`);
};

const Search = () => {
  const [searchValue, setSearchValue] = useState(0);

  return (
    <Jumbotron>
      <div className="SearchContainer">
        <h1 className="header"> Search for transactions or blocks </h1>
        <div className="SearchForm">
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
