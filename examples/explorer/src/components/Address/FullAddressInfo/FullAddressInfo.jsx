import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import AddressInfo from '../AddressInfo/AddressInfo';
import { AddressTransactionTable } from '../../Transaction';

const FullAddressInfo = ({ address }) => {
  return (
    <div className="entityInfoContainer">
      <AddressInfo {...{ address }} />
      <AddressTransactionTable {...{ address }} />
    </div>
  );
};

export default createFragmentContainer(FullAddressInfo, {
  address: graphql`
    fragment FullAddressInfo_address on Address {
      ...AddressInfo_address
      ...AddressTransactionTable_address
    }
  `
});
