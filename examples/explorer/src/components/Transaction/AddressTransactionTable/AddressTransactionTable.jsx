import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import TransactionTable from '../TransactionTable/TransactionTable';
import {
  getNextPageQueryParam,
  getPreviousPageQueryParam
} from '../../../helpers/paginationHelper';

const AddressTransactionTable = ({ address, relay }) => {
  if (!address.transactions) {
    return null;
  }

  const connection = address.transactions;

  const handlePageChange = (vars, callback) => {
    relay.refetch(
      {
        address: address.id,
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
  AddressTransactionTable,
  {
    address: graphql`
      fragment AddressTransactionTable_address on Address
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
    query AddressTransactionTableRefetchQuery(
      $address: String!
      $first: Int
      $last: Int
      $after: BlockCursor
      $before: BlockCursor
    ) {
      address(bech32: $address) {
        ...AddressTransactionTable_address
          @arguments(first: $first, last: $last, after: $after, before: $before)
      }
    }
  `
);
