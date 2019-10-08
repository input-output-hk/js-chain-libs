import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import BlockTable from '../BlockTable/BlockTable';
import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import { blocksFromBlockConnection } from '../../../helpers/blockHelper';

// TODO: Think on some way of extract shared code between EpochBlockTable and BlockPagedTable
const EpochBlockTable = ({ epoch, relay }) => {
  const [start, setStart] = useState(1);
  if (!epoch.blocks) {
    return null;
  }

  const blocks = blocksFromBlockConnection(epoch.blocks);
  const { pageInfo } = epoch.blocks;

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

  const openPreviousPage = () => {
    handlePageChange({ before: pageInfo.startCursor, last: TABLE_PAGE_SIZE }, () =>
      setStart(start - TABLE_PAGE_SIZE)
    );
  };

  const openNextPage = () => {
    handlePageChange({ after: pageInfo.endCursor, first: TABLE_PAGE_SIZE }, () =>
      setStart(start + TABLE_PAGE_SIZE)
    );
  };

  const openLastPage = () => {
    handlePageChange({ last: TABLE_PAGE_SIZE }, () => setStart(start - TABLE_PAGE_SIZE));
  };

  const openFirstPage = () => {
    handlePageChange({ first: TABLE_PAGE_SIZE }, () => setStart(0));
  };

  return (
    <>
      <BlockTable {...{ blocks }} />
      <Pagination>
        <Pagination.Item onClick={openLastPage} disabled={!pageInfo.hasNextPage}>
          Last
        </Pagination.Item>
        <Pagination.Prev onClick={openNextPage} disabled={!pageInfo.hasNextPage} />
        <Pagination.Ellipsis disabled />
        <Pagination.Next onClick={openPreviousPage} disabled={!pageInfo.hasPreviousPage} />
        <Pagination.Item onClick={openFirstPage} disabled={!pageInfo.hasPreviousPage}>
          First
        </Pagination.Item>
      </Pagination>
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
              ...BlockTable_blocks
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
