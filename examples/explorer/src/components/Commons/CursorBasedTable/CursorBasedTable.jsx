import React from 'react';
import { Table } from 'antd';

import { getNodeList } from '../../../helpers/paginationHelper';
import CursorPagination from '../CursorPagination/CursorPagination';

import 'antd/dist/antd.css';
import './cursorBasedTable.scss';

/**
 * This component receives a set of columns, a sorter function and return a CursorBasedTable
 */
const CursorBasedTable = ({ columns, sorter }) => ({ connection, onNextPage, onPreviousPage }) => {
  const nodes = getNodeList(connection);
  const data = sorter ? nodes.sort(sorter) : nodes;

  const total = Number.parseInt(connection.totalCount, 10);

  return (
    <div className="cursorBasedTable">
      <Table pagination={false} columns={columns} dataSource={data} />
      <CursorPagination {...{ total, onNextPage, onPreviousPage }} startAtEnd />
    </div>
  );
};

export default CursorBasedTable;
