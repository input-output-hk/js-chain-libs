import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';
import { StakePoolLink } from '../../Commons';

const OwnerStakeDelegation = ({ certificate }) => (
  <div className="keyValueTable">
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Type:</td>
          <td>{certificate.__typename}</td>
        </tr>
        <tr>
          <td>Pool Id:</td>
          <td>
            <StakePoolLink id={certificate.pool.id} />
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
);

export default createFragmentContainer(
  OwnerStakeDelegation,

  {
    certificate: graphql`
      fragment OwnerStakeDelegation_certificate on OwnerStakeDelegation {
        __typename
        pool {
          id
        }
      }
    `
  }
);
