// @flow
import React from 'react';
import Button from 'react-bootstrap/Button';
import ListingColumn from './Listing/ListingColumn';
import ListingTable from './Listing/ListingTable';
import type { PoolId } from '../models';
import ListingRow from './Listing/ListingRow';

type Props = {
  stakePools: Array<PoolId>
};

export default ({ stakePools }: Props) => {
  return (
    <ListingTable>
      {stakePools &&
        stakePools.map((poolId: PoolId) => {
          return (
            <ListingRow itemKey={poolId}>
              <ListingColumn xs={8}>{poolId}</ListingColumn>
              <ListingColumn xs={3}>
                <Button type="button" disabled size="sm" />
              </ListingColumn>
            </ListingRow>
          );
        })}
    </ListingTable>
  );
};
