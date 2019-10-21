import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { EmptyResult, CopiableItem } from '../../Commons';

const AddressInfo = ({ address }) => {
  if (!address) {
    return <EmptyResult {...{ entityName: 'Address' }} />;
  }

  return (
    <div className="entityInfoTable">
      <h2>Address</h2>
      <div className="keyValueTable">
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td>Id:</td>
              <td>
                <CopiableItem text={address.id} />
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
