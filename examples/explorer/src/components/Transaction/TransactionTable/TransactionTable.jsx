import React from 'react';

import { inputsAmount, outputsAmount, feesAmount } from '../../../helpers/transactionHelper';
import { Amount, TransactionLink, BlockLink, CursorBasedTable } from '../../Commons';

import './transactionTable.scss';

const columns = [
  {
    title: 'Hash',
    id: 'hash',
    render: tx => <TransactionLink id={tx.id} />,
    ellipsis: true,
    width: '40%'
  },
  {
    title: 'Block',
    id: 'block',
    render: tx => <BlockLink chainLength={tx.block.chainLength} />,
    width: '15%'
  },
  {
    title: 'Input amount',
    id: 'inputAmount',
    render: tx => <Amount decimalAmount={inputsAmount(tx)} />,
    width: '15%'
  },
  {
    title: 'Output amount',
    id: 'outputAmount',
    render: tx => <Amount decimalAmount={outputsAmount(tx)} />,
    width: '15%'
  },
  {
    title: 'Fees amount',
    id: 'feesAmount',
    render: tx => <Amount decimalAmount={feesAmount(tx)} />,
    width: '15%'
  }
];

// Necesary because there is a problem with sort and paging with Antd table
const sorter = (b1, b2) => Number(b2.chainLength) - Number(b1.chainLength);

export default CursorBasedTable({ columns, sorter });
