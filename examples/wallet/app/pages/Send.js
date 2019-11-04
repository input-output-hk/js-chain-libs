// @flow
import React from 'react';
import Container from 'react-bootstrap/Container';
import SendTransaction from '../containers/SendTransaction';
import SidebarLayout from '../layouts/SidebarLayout';

export default () => {
  return (
    <SidebarLayout>
      <Container>
        <h2> Send funds</h2>
        <SendTransaction />
      </Container>
    </SidebarLayout>
  );
};
