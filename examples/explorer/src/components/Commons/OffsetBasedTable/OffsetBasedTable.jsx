import React from 'react';
import { Table } from 'antd';

import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import { getNodeList } from '../../../helpers/paginationHelper';
import 'antd/dist/antd.css';

/**
 * This component receives a set of columns, a sorter function and return an OffsetBase
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
