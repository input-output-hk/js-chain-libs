import React from 'react';

import { BlockLink, EpochLink, OffsetBasedTable } from '../../Commons';
import 'antd/dist/antd.css';

const columns = [
  {
    title: 'Chain length',
    id: 'chainLength',
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
    dataIndex: 'transactions.totalCount',
    width: '15%'
  }
];

// Necesary because there is a problem with sort and paging with Antd table
const sorter = (b1, b2) => Number(b2.chainLength) - Number(b1.chainLength);

export default OffsetBasedTable({ columns, sorter });
