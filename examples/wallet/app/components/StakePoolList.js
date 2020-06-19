// @flow
import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import ListingColumn from './Listing/ListingColumn';
import ListingTable from './Listing/ListingTable';
import type { NewDelegation, PoolId, Delegation } from '../models';
import type { PoolSelectionHandler } from './StakeDelegation';
import { percentageFromParts } from '../utils/proportionsHelper';
import ListingRow from './Listing/ListingRow';
import styles from './StakePoolList.scss';

type Props = {
  stakePools: Array<PoolId>,
  newDelegation: NewDelegation,
  currentDelegation?: Delegation,
  onSelection: PoolSelectionHandler
};

export default ({
  stakePools,
  onSelection,
  currentDelegation,
  newDelegation
}: Props) => {
  return (
    <ListingTable>
      {stakePools &&
        stakePools.map((poolId: PoolId) => {
          const activeDelegation = newDelegation[poolId];
          const rowStyles: { color: string } = activeDelegation
            ? { color: activeDelegation.color }
            : {};
          const newDelegationPercentage: number =
            newDelegation && percentageFromParts(newDelegation, poolId);
          const currentDelegationPercentage =
            currentDelegation && percentageFromParts(currentDelegation, poolId);
          return (
            <ListingRow itemKey={poolId}>
              <ListingColumn style={rowStyles} className={styles.poolId} xs={4}>
                {poolId}
              </ListingColumn>
              <ListingColumn style={rowStyles} xs={2}>
                {newDelegationPercentage}%
              </ListingColumn>
              <ListingColumn xs={2}>
                {currentDelegationPercentage}%
              </ListingColumn>
              <ListingColumn xs={3}>
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
              </ListingColumn>
            </ListingRow>
          );
        })}
    </ListingTable>
  );
};
