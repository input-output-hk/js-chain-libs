import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import TransactionTable from '../TransactionTable/TransactionTable';
import { pageNumberDesc, getDescPageQuery } from '../../../helpers/paginationHelper';

const BlockTransactionTable = ({ block, relay }) => {
  if (!block.transactions) {
    return null;
  }

  const connection = block.transactions;
  const currentPage = pageNumberDesc(connection);

  const handlePageChange = page => {
    const params = getDescPageQuery(page.current, connection.totalCount);

    relay.refetch(
      {
        blockId: block.id,
        first: params.first || null,
        last: params.last || null,
        after: params.after || null,
        before: params.before || null
      },
      error => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
        }
      }
    );
  };

  return (
    <>
      <h2>Transactions</h2>
      <TransactionTable {...{ currentPage, connection, handlePageChange }} />
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
          after: { type: "IndexCursor" }
          before: { type: "IndexCursor" }
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
      $after: IndexCursor
      $before: IndexCursor
    ) {
      block(id: $blockId) {
        ...BlockTransactionTable_block
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    }
  `
);
