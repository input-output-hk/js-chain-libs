// @flow
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import type { PoolId } from '../models';
import ListingRow from './ListingRow';
import styles from './StakePoolList.scss';

type Props = {
  stakePools: Array<PoolId>,
  currentDelegation: PoolId,
  onSelection: (poolId: PoolId) => void
};

export default ({ stakePools, onSelection, currentDelegation }: Props) => {
  return (
    <Container>
      {stakePools &&
        stakePools.map((poolId: PoolId) => (
          <ListingRow key={poolId}>
            <Col className={styles.poolId} xs={6}>
              {poolId}
            </Col>
            <Col xs={2}>{poolId !== currentDelegation ? '100%' : '0%'}</Col>
            <Col xs={3}>
              <Button
                type="button"
                size="sm"
                onClick={() => onSelection(poolId)}
              >
                Add to delegation
              </Button>
            </Col>
          </ListingRow>
        ))}
    </Container>
  );
};
