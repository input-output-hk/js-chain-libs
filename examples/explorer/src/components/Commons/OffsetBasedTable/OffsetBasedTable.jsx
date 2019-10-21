import React from 'react';
import { Table } from 'antd';

import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import { getNodeList } from '../../../helpers/paginationHelper';
import 'antd/dist/antd.css';

/**
 * This component receives a set of columns, a sorter function and return an OffsetBasedTable.
 * @param columns An array of Ant Table column objects.
 * @param sorter Sorter function is used to avoid using Ant table's sort because it
 * cause some problems with pagination.
 *
 * An Offset based table is able to move and show data from specific pages.
 * @param currentPage Number of the current page.
 * @param connection A GraphQL connection object.
 * @param handlePageChange A function to handle page changes and obtain more data.
 */
const OffsetBasedTable = ({ columns, sorter }) => ({
  currentPage,
  connection,
  handlePageChange
}) => {
  const nodes = getNodeList(connection);
  const total = Number.parseInt(connection.totalCount, 10);
  const data = sorter ? nodes.sort(sorter) : nodes;

  const onChange = page => {
    handlePageChange(page, total);
  };

  return (
    <Table
      pagination={{
        total,
        current: currentPage,
        pageSize: TABLE_PAGE_SIZE
      }}
      columns={columns}
      dataSource={data}
      onChange={onChange}
    />
  );
};

export default OffsetBasedTable;
