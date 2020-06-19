// @flow
import React from 'react';
import type { Node } from 'react';
import Col from 'react-bootstrap/Col';

type Props = {
  children: Node
};

export default ({ children, ...other }: Props) => (
  <Col {...other} as="td">
    {children}
  </Col>
);
