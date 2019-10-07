import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

import BlockTable from '../BlockTable/BlockTable';
import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import { blocksFromBlockConnection } from '../../../helpers/blockHelper';

const BlockPagedTable = ({ data, relay }) => {
  const [start, setStart] = useState(1);
  const blocks = blocksFromBlockConnection(data.blocks);
  const { pageInfo } = data.blocks;

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

export default BlockPagedTable;
