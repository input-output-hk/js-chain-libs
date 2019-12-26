// @flow
import React from 'react';
import config from 'config';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import SendTransaction from '../containers/SendTransaction';
import SidebarLayout from '../containers/SidebarLayout';

export default () => {
  return (
    <SidebarLayout>
      <Container>
        <Row className="justify-content-center m-2">
          <h2> Send {config.get('coinName')}</h2>
        </Row>
        <SendTransaction />
      </Container>
    </SidebarLayout>
  );
};
