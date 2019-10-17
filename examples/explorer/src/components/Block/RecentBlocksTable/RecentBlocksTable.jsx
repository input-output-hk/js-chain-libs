import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import BlockTable from '../BlockTable/BlockTable';
import { getDescPageQuery, pageNumberDesc } from '../../../helpers/paginationHelper';

// Getting an OffsetBasedTable
const OffsetTable = BlockTable({});

const RecentBlocksTable = ({ data, relay }) => {
  const connection = data.blocks;
  const currentPage = pageNumberDesc(connection);

  const handlePageChange = page => {
    const params = getDescPageQuery(page.current, connection.totalCount);

    relay.refetch(
      {
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
    <div className="entityInfoContainer">
      <h2> Recent blocks </h2>
      <OffsetTable {...{ currentPage, connection, handlePageChange }} />
    </div>
  );
};

export default createRefetchContainer(
  RecentBlocksTable,
  {
    data: graphql`
      fragment RecentBlocksTable_data on Query
        @argumentDefinitions(
          first: { type: "Int" }
          last: { type: "Int", defaultValue: 10 }
          after: { type: "BlockCursor" }
          before: { type: "BlockCursor" }
        ) {
        blocks: allBlocks(first: $first, last: $last, after: $after, before: $before) {
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
    query RecentBlocksTableRefetchQuery(
      $first: Int
      $last: Int
      $after: BlockCursor
      $before: BlockCursor
    ) {
      ...RecentBlocksTable_data
        @arguments(first: $first, last: $last, after: $after, before: $before)
    }
  `
);
