import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import { BlockTable } from '../../Block';
import { pageNumberDesc, getDescPageQuery } from '../../../helpers/paginationHelper';

const StakePoolBlockTable = ({ stakePool, relay }) => {
  if (!stakePool.blocks) {
    return null;
  }

  const connection = stakePool.blocks;
  const currentPage = pageNumberDesc(connection);

  const handlePageChange = page => {
    const params = getDescPageQuery(page.current, connection.totalCount);

    relay.refetch(
      {
        poolId: stakePool.id,
        first: params.first || null,
        last: params.last || null,
        after: params.after || null,
        before: params.before || null
      },
      error => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
        }
      }
    );
  };

  return (
    <>
      <h2>Blocks</h2>
      <BlockTable {...{ currentPage, connection, handlePageChange }} />
    </>
  );
};

export default createRefetchContainer(
  StakePoolBlockTable,
  {
    stakePool: graphql`
      fragment StakePoolBlockTable_stakePool on Pool
        @argumentDefinitions(
          first: { type: "Int" }
          last: { type: "Int" }
          after: { type: "IndexCursor" }
          before: { type: "IndexCursor" }
        ) {
        id
        blocks(first: $first, last: $last, after: $after, before: $before) {
          edges {
            cursor
            node {
              id
              date {
                epoch {
                  id
                }
                slot
              }
              chainLength
              transactions {
                totalCount
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
          totalCount
        }
      }
    `
  },
  graphql`
    query StakePoolBlockTableRefetchQuery(
      $poolId: PoolId!
      $first: Int
      $last: Int
      $after: IndexCursor
      $before: IndexCursor
    ) {
      stakePool(id: $poolId) {
        ...StakePoolBlockTable_stakePool
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    }
  `
);
