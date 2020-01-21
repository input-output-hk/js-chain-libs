// @flow
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import SidebarLayout from '../containers/SidebarLayout';

export default () => (
  <SidebarLayout>
    <Container>
      <Row className="justify-content-center m-2">
        <h2>My stakepools</h2>
      </Row>
    </Container>
  </SidebarLayout>
);
