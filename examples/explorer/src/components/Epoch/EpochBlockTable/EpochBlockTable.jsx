import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import { BlockTable } from '../../Block';
import { getDescPageQuery, pageNumberDesc } from '../../../helpers/paginationHelper';

const EpochBlockTable = ({ epoch, relay }) => {
  if (!epoch.blocks) {
    return null;
  }

  const connection = epoch.blocks;
  const currentPage = pageNumberDesc(connection);

  const handlePageChange = page => {
    const params = getDescPageQuery(page.current, connection.totalCount);

    relay.refetch(
      {
        epochId: epoch.id,
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
  EpochBlockTable,
  {
    epoch: graphql`
      fragment EpochBlockTable_epoch on Epoch
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
    query EpochBlockTableRefetchQuery(
      $epochId: EpochNumber!
      $first: Int
      $last: Int
      $after: IndexCursor
      $before: IndexCursor
    ) {
      epoch(id: $epochId) {
        ...EpochBlockTable_epoch
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    }
  `
);
