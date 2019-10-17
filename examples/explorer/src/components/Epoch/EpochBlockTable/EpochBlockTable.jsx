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

const EpochBlockTable = ({ epoch, relay }) => {
  if (!epoch.blocks) {
    return null;
  }

  const connection = epoch.blocks;

  const handlePageChange = (vars, callback) => {
    relay.refetch(
      {
        epochId: epoch.id,
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
  EpochBlockTable,
  {
    epoch: graphql`
      fragment EpochBlockTable_epoch on Epoch
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
                id
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
    query EpochBlockTableRefetchQuery(
      $epochId: EpochNumber!
      $first: Int
      $last: Int
      $after: BlockCursor
      $before: BlockCursor
    ) {
      epoch(id: $epochId) {
        ...EpochBlockTable_epoch
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    }
  `
);
