// @flow
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import type { PoolId } from '../models';
import type { DelegationInfo, PoolSelectionHandler } from './StakeDelegation';
import ListingRow from './ListingRow';
import styles from './StakePoolList.scss';

type Props = {
  stakePools: Array<PoolId>,
  newDelegation: {
    [PoolId]: DelegationInfo
  },
  currentDelegation: PoolId,
  onSelection: PoolSelectionHandler
};

export default ({
  stakePools,
  onSelection,
  currentDelegation,
  newDelegation
}: Props) => {
  const totalParts: number = Object.values(newDelegation).reduce(
    (acc: number, it: DelegationInfo) => acc + it.parts,
    0
  );
  const percentageFromParts = (poolId: PoolId) =>
    newDelegation[poolId]
      ? parseInt((100 * newDelegation[poolId].parts) / totalParts, 10)
      : 0;
  return (
    <Container>
      {stakePools &&
        stakePools.map((poolId: PoolId) => {
          const activeDelegation: DelegationInfo = newDelegation[poolId];
          const rowStyles: { color: string } = activeDelegation
            ? { color: activeDelegation.color }
            : {};
          const newDelegationPercentage: number =
            totalParts && percentageFromParts(poolId);
          return (
            <ListingRow key={poolId}>
              <Col style={rowStyles} className={styles.poolId} xs={4}>
                {poolId}
              </Col>
              <Col style={rowStyles} xs={2}>
                {newDelegationPercentage}%
              </Col>
              <Col xs={2}>{poolId === currentDelegation ? '100%' : '0%'}</Col>
              <Col xs={3}>
                <Row className="justify-content-between">
                  <Button
                    type="button"
                    disabled={!newDelegationPercentage}
                    size="sm"
                    onClick={() => onSelection(poolId, -1)}
                  >
                    Reduce delegation
                  </Button>
                  <Button
                    type="button"
                    disabled={newDelegationPercentage === 100}
                    size="sm"
                    onClick={() => onSelection(poolId, 1)}
                  >
                    Add delegation
                  </Button>
                </Row>
              </Col>
            </ListingRow>
          );
        })}
    </Container>
  );
};
