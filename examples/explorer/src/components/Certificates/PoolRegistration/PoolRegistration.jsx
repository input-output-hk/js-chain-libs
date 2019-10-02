import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import '../../generalStyling.scss';

const PoolRegistration = ({ certificate }) => {
  return (
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
};

export default createFragmentContainer(
  PoolRegistration,
  // Each key specified in this object will correspond to a prop available to the component
  {
    certificate: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
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
