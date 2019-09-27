import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    <>
      <Jumbotron>
        <Container>
          <h1 className="header"> Search for transactions or blocks </h1>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Form.Control
                type="text"
                onChange={event => setSearchValue(event.target.value)}
                placeholder="Search for transaction, block or certificate id ..."
              />
            </Col>
            <Col md={{ span: 1 }}>
              <Button variant="primary" onClick={() => onSearchClick(searchValue)}>
                {' '}
                Search{' '}
              </Button>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    </>
  );
};

export default Search;
