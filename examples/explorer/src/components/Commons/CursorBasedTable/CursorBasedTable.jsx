import React from 'react';
import { Table } from 'antd';

import { getNodeList } from '../../../helpers/paginationHelper';
import CursorPagination from '../CursorPagination/CursorPagination';

import 'antd/dist/antd.css';
import './cursorBasedTable.scss';

/**
 * This component receives a set of columns, a sorter function and return a CursorBasedTable.
 * @param columns An array of Ant Table column objects.
 * @param sorter Sorter function is used to avoid using Ant table's sort because it
 * cause some problems with pagination.
 *
 * A CursorBasedTable can only move one page at a time.
 * @param connection A GraphQL connection object.
 * @param onNextPage A function that handles the transition to next page.
 * @param onPreviousPage A function that handles the transition to previous page.
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
