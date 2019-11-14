// @flow
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AccountInfo from '../containers/AccountInfo';
import TransactionListing from '../containers/TransactionListing';
import SidebarLayout from '../layouts/SidebarLayout';

export default () => {
  return (
    <SidebarLayout>
      <Container>
        <Row className="justify-content-center m-2">
          <h2> Account Info</h2>
        </Row>
        <AccountInfo />
        <Row className="justify-content-center m-1">
          <h4 className="text-center">Transactions</h4>
        </Row>
        <hr />
        <TransactionListing />
      </Container>
    </SidebarLayout>
  );
};
