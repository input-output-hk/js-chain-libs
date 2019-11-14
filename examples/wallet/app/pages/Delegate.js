// @flow
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import SidebarLayout from '../layouts/SidebarLayout';
import StakeDelegation from '../containers/StakeDelegation';

export default () => {
  return (
    <SidebarLayout>
      <Container>
        <Row className="justify-content-center m-2">
          <h2>Stake Delegation</h2>
        </Row>
        <StakeDelegation />
      </Container>
    </SidebarLayout>
  );
};
