import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './addressInfo.scss';
import EmptyResult from '../../Commons/EmptyResult/EmptyResult';
import AddressLink from '../../Commons/AddressLink/AddressLink';

const AddressInfo = ({ address }) => {
  if (!address) {
    return <EmptyResult {...{ entityName: 'Address' }} />;
  }
  const { transactions } = address;

  return (
    <div className="addressInfo">
      <h2>Address</h2>
      <div className="keyValueTable">
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td>Id:</td>
              <td>
                <AddressLink id={address.id} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default createFragmentContainer(AddressInfo, {
  address: graphql`
    fragment AddressInfo_address on Address {
      id
    }
  `
});
