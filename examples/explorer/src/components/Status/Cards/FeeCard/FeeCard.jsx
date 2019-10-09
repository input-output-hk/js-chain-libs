import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import '../statusCard.scss';
/** Shows the current fee information */
const FeeCard = ({ feeSettings }) => (
  <div className="statusCard">
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
  </div>
);

export default createFragmentContainer(
  FeeCard,
  
  {
    feeSettings: graphql`
      
      fragment FeeCard_feeSettings on FeeSettings {
        constant
        coefficient
      }
    `
  }
);
