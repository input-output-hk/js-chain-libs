import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import TransactionTable from '../TransactionTable/TransactionTable';
import {
  getNextPageQueryParam,
  getPreviousPageQueryParam
} from '../../../helpers/paginationHelper';

const BlockTransactionTable = ({ block, relay }) => {
  if (!block.transactions) {
    return null;
  }

  const connection = block.transactions;

  const handlePageChange = (vars, callback) => {
    relay.refetch(
      {
        blockId: block.id,
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

  const onPreviousPage = () => {
    handlePageChange(getPreviousPageQueryParam(connection));
  };

  const onNextPage = () => {
    handlePageChange(getNextPageQueryParam(connection));
  };

  return (
    <>
      <h2>Transactions</h2>
      <TransactionTable {...{ connection, onNextPage, onPreviousPage }} />
    </>
  );
};

export default createRefetchContainer(
  BlockTransactionTable,
  {
    block: graphql`
      fragment BlockTransactionTable_block on Block
        @argumentDefinitions(
          first: { type: "Int" }
          last: { type: "Int" }
          after: { type: "TransactionCursor" }
          before: { type: "TransactionCursor" }
        ) {
        id
        transactions(first: $first, last: $last, after: $after, before: $before) {
          edges {
            cursor
            node {
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
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
          totalCount
        }
      }
    `
  },
  graphql`
    query BlockTransactionTableRefetchQuery(
      $blockId: String!
      $first: Int
      $last: Int
      $after: BlockCursor
      $before: BlockCursor
    ) {
      block(id: $blockId) {
        ...BlockTransactionTable_block
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    }
  `
);
