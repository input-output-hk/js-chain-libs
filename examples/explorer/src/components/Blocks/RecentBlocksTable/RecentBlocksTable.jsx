import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import BlockPagedTable from '../BlockPagedTable/BlockPagedTable';

const RecentBlocksTable = ({ data, relay }) => {
  const blockConnection = data.blocks;

  const handlePageChange = (vars, callback) => {
    relay.refetch(
      {
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

  return (
    <div className="entityInfoContainer">
      <h2> Recent blocks </h2>
      <BlockPagedTable {...{ blockConnection, handlePageChange }} />;
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
          ...BlockPagedTable_blockConnection
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
