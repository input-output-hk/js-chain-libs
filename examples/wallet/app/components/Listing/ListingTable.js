// @flow
import React from 'react';
import type { Node } from 'react';
import Container from 'react-bootstrap/Container';

type Props = {
  children: Node
};

export default ({ children, ...other }: Props) => (
  <Container {...other} as="table">
    {children}
  </Container>
);
