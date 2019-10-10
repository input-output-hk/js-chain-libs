import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import BlockPagedTable from '../BlockPagedTable/BlockPagedTable';

const EpochBlockTable = ({ epoch, relay }) => {
  if (!epoch.blocks) {
    return null;
  }
  const blockConnection = epoch.blocks;
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

  return (
    <>
      <h2>Blocks</h2>
      <BlockPagedTable {...{ handlePageChange, blockConnection }} />
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
          ...BlockPagedTable_blockConnection
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
