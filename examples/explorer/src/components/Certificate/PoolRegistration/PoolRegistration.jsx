import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

const PoolRegistration = ({ certificate }) => (
  <div className="keyValueTable">
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Type:</td>
          <td>{certificate.__typename}</td>
        </tr>
        <tr>
          <td>Pool Id:</td>
          <td>{certificate.pool.id}</td>
        </tr>
        <tr>
          <td>Serial:</td>
          <td>{certificate.serial}</td>
        </tr>
        <tr>
          <td>Start validity:</td>
          <td>{certificate.startValidity}</td>
        </tr>
        <tr>
          <td>Management threshold:</td>
          <td>{certificate.managementThreshold}</td>
        </tr>
      </tbody>
    </Table>
  </div>
);

export default createFragmentContainer(
  PoolRegistration,

  {
    certificate: graphql`
      fragment PoolRegistration_certificate on PoolRegistration {
        __typename
        pool {
          id
        }
        serial
        startValidity
        managementThreshold
        owners
      }
    `
  }
);
