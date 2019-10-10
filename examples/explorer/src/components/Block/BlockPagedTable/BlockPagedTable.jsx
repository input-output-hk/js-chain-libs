import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import BlockTable from '../BlockTable/BlockTable';
import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import { blocksFromBlockConnection } from '../../../helpers/blockHelper';

/**
 * This component receives a BlockConnection and a function to refetch data
 * and renders a paged table.
 */
const BlockPagedTable = ({ blockConnection, handlePageChange }) => {
  const [start, setStart] = useState();
  const { pageInfo } = blockConnection;
  const blocks = blocksFromBlockConnection(blockConnection);

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

export default createFragmentContainer(BlockPagedTable, {
  blockConnection: graphql`
    fragment BlockPagedTable_blockConnection on BlockConnection {
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
  `
});
