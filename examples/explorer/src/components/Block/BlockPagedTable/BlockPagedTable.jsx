import React from 'react';
import { Table } from 'antd';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { BlockLink, EpochLink } from '../../Commons';
import { TABLE_PAGE_SIZE } from '../../../helpers/constants';
import { getNodeList, getDescPageQuery, pageNumberDesc } from '../../../helpers/paginationHelper';
import 'antd/dist/antd.css';

const columns = [
  {
    title: 'Chain length',
    id: 'chainLength',
    sortOrder: 'descend',
    sorter: (b1, b2) => Number(b1.chainLength) - Number(b2.chainLength),
    render: block => <BlockLink chainLength={block.chainLength} />,
    width: '15%'
  },
  {
    title: 'Hash',
    id: 'hash',
    render: block => <BlockLink id={block.id} />,
    ellipsis: true,
    width: '40%'
  },
  {
    title: 'Epoch',
    id: 'epoch',
    render: block => <EpochLink number={block.date.epoch.id} />,
    width: '15%'
  },
  {
    title: 'Slot',
    dataIndex: 'date.slot',
    width: '15%'
  },
  {
    title: 'Tx count',
    dataIndex: 'transactions.length',
    width: '15%'
  }
];

/**
 * This component receives a BlockConnection and a function to refetch data
 * and renders a paged table.
 */
const BlockPagedTable = ({ blockConnection, handlePageChange }) => {
  const blocks = getNodeList(blockConnection);
  const current = pageNumberDesc(blockConnection);
  const total = Number.parseInt(blockConnection.totalCount, 10);

  const handleTableChange = page => {
    openSpecificPage(page.current);
  };

  const openSpecificPage = page => {
    const params = getDescPageQuery(page, total);
    handlePageChange(params);
  };

  return (
    <Table
      pagination={{
        total,
        current,
        pageSize: TABLE_PAGE_SIZE
      }}
      columns={columns}
      dataSource={blocks}
      onChange={handleTableChange}
    />
  );
};

export default createFragmentContainer(BlockPagedTable, {
  blockConnection: graphql`
    fragment BlockPagedTable_blockConnection on BlockConnection {
      edges {
        cursor
        node {
          id
          date {
            epoch {
              id
            }
            slot
          }
          chainLength
          transactions {
            id
          }
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
