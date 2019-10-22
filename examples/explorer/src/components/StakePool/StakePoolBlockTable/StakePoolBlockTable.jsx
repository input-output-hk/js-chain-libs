import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import { BlockTable } from '../../Block';
import {
  getNextPageQueryParam,
  getPreviousPageQueryParam
} from '../../../helpers/paginationHelper';

// Getting a CursorBased Table
const CursorTable = BlockTable({ cursorType: true });

const StakePoolBlockTable = ({ stakePool, relay }) => {
  if (!stakePool.blocks) {
    return null;
  }

  const connection = stakePool.blocks;
  const handlePageChange = (vars, callback) => {
    relay.refetch(
      {
        poolId: stakePool.id,
        first: vars.first || null,
        last: vars.last || null,
        after: vars.after || null,
        before: vars.before || null
      },
      error => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
        }
        callback();
      }
    );
  };

  const onPreviousPage = () => {
    handlePageChange(getPreviousPageQueryParam(connection));
  };

  const onNextPage = () => {
    handlePageChange(getNextPageQueryParam(connection));
  };

  return (
    <>
      <h2>Blocks</h2>
      <CursorTable {...{ connection, onNextPage, onPreviousPage }} />
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
          after: { type: "BlockCursor" }
          before: { type: "BlockCursor" }
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
      $after: BlockCursor
      $before: BlockCursor
    ) {
      stakePool(id: $poolId) {
        ...StakePoolBlockTable_stakePool
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    }
  `
);
