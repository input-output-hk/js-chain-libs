import React from 'react';
import { Table } from 'antd';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { inputsAmount, outputsAmount, feesAmount } from '../../../helpers/transactionHelper';
import { Amount, TransactionLink, BlockLink } from '../../Commons';

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

const TransactionTable = ({ transactions }) => (
  <div className="transactionTable">
    <h3> Transactions </h3>
    <Table {...{ columns, pagination: false, dataSource: transactions }} />
  </div>
);

export default createFragmentContainer(TransactionTable, {
  transactions: graphql`
    fragment TransactionTable_transactions on Transaction @relay(plural: true) {
      id
      inputs {
        amount
      }
      outputs {
        amount
      }
      block {
        chainLength
      }
    }
  `
});
