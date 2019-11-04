// @flow
import React from 'react';
import Container from 'react-bootstrap/Container';
import SidebarLayout from '../layouts/SidebarLayout';
import StakeDelegation from '../containers/StakeDelegation';

export default () => {
  return (
    <SidebarLayout>
      <Container>
        <StakeDelegation />
      </Container>
    </SidebarLayout>
  );
};
