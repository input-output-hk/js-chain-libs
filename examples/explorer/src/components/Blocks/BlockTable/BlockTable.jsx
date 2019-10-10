import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import BlockTablePage from '../BlockTablePage/BlockTablePage';
import { TABLE_PAGE_SIZE } from '../../../helpers/constants';

const getBlocksFromConnection = data => {
  return data.allBlocks.edges.map(edge => edge.node);
};

const BlockTable = ({ data, relay }) => {
  const [start, setStart] = useState(1);
  const blocks = getBlocksFromConnection(data);
  const { pageInfo } = data.allBlocks;

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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Chain Length</th>
            <th>Hash</th>
            <th>Epoch</th>
            <th>Slot</th>
            <th>Tx count</th>
          </tr>
        </thead>
        <BlockTablePage {...{ blocks }} />
      </Table>
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
  BlockTable,
  {
    data: graphql`
      fragment BlockTable_data on Query
        @argumentDefinitions(
          first: { type: "Int" }
          last: { type: "Int" }
          after: { type: "BlockCursor" }
          before: { type: "BlockCursor" }
        ) {
        allBlocks(first: $first, last: $last, after: $after, before: $before) {
          edges {
            cursor
            node {
              ...BlockTablePage_blocks
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
    query BlockTableRefetchQuery(
      $first: Int
      $last: Int
      $after: BlockCursor
      $before: BlockCursor
    ) {
      ...BlockTable_data @arguments(first: $first, last: $last, after: $after, before: $before)
    }
  `
);
