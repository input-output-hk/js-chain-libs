import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import AddressInfo from '../AddressInfo/AddressInfo';
import TransactionTable from '../../Transactions/TransactionTable/TransactionTable';

const FullAddressInfo = ({ address }) => {
  const { transactions } = address;
  return (
    <div className="entityInfoContainer">
      <AddressInfo {...{ address }} />
      <TransactionTable {...{ transactions, showBlocks: true }} />
    </div>
  );
};

export default createFragmentContainer(FullAddressInfo, {
  address: graphql`
    fragment FullAddressInfo_address on Address {
      ...AddressInfo_address
      transactions {
        ...TransactionTable_transactions
      }
    }
  `
});
