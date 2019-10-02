import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import '../../generalStyling.scss';

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
            <td>Account Id:</td>
            <td>{certificate.account.id}</td>
          </tr>
          <tr>
            <td>Pool Id:</td>
            <td>{certificate.pool.id}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default createFragmentContainer(
  StakeDelegation,
  // Each key specified in this object will correspond to a prop available to the component
  {
    certificate: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
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
