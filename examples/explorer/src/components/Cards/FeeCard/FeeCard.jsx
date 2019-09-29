import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows the current fee information */
const FeeCard = ({ feeSettings }) => (
  <Card>
    <Card.Header as="h5">Fee information</Card.Header>
    <Card.Body>
      <Table borderless>
        <tbody>
          <tr>
            <td>Constant:</td>
            <td>{feeSettings.constant}</td>
          </tr>
          <tr>
            <td>Coefficient:</td>
            <td>{feeSettings.constant} </td>
          </tr>
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

export default createFragmentContainer(
  FeeCard,
  // Each key specified in this object will correspond to a prop available to the component
  {
    feeSettings: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment FeeCard_feeSettings on FeeSettings {
        constant
        coefficient
      }
    `
  }
);
