import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import '../../../generalStyling.scss';
import AddressLink from '../../Commons/AddressLink/AddressLink';

const StakeDelegation = ({ certificate }) => {
  return (
    <div className="keyValueTable">
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Type:</td>
            <td>{certificate.__typename}</td>
          </tr>
          <tr>
            <td>Account:</td>
            <td>
              <AddressLink id={certificate.account.id} />
            </td>
          </tr>
          <tr>
            <td>Pool:</td>
            <td>{certificate.pool.id}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default createFragmentContainer(
  StakeDelegation,

  {
    certificate: graphql`
      fragment StakeDelegation_certificate on StakeDelegation {
        __typename
        account {
          id
        }
        pool {
          id
        }
      }
    `
  }
);
