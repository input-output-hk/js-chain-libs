// @flow
import React from 'react';
import Container from 'react-bootstrap/Container';
import RefreshBalance from '../containers/RefreshBalance';
import SidebarLayout from '../containers/SidebarLayout';

export default () => {
  return (
    <SidebarLayout>
      <Container>
        <h2>Settings</h2>
        <RefreshBalance />
      </Container>
    </SidebarLayout>
  );
};
