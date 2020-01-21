// @flow
import React from 'react';
import type { Node } from 'react';
import Row from 'react-bootstrap/Row';
import styles from './ListingRow.scss';

type Props = {
  itemKey: string | number,
  className?: string,
  children: Node
};

export default ({ itemKey, className, children }: Props) => (
  <Row key={itemKey} className={`${className || ''} ${styles.row}`}>
    {children}
  </Row>
);
