// @flow
import React from 'react';
import type { Node } from 'react';
import Row from 'react-bootstrap/Row';
import styles from './ListingRow.scss';

type Props = {
  key: string | number,
  className?: string,
  children: Node
};

export default ({ key, className, children }: Props) => (
  <Row key={key} className={`${className || ''} ${styles.row}`}>
    {children}
  </Row>
);
