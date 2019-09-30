import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

import '../statusCard.scss';
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows information of current epoch */
const EpochCard = ({ epoch }) => (
  <div className="StatusCard">
    <Card>
      <Card.Header as="h5">Epoch</Card.Header>
      <Card.Body>
        <Table borderless>
          <tbody>
            <tr>
              <td>Id:</td>
              <td>{epoch.id}</td>
            </tr>
            <tr>
              <td>Total Blocks:</td>
              <td>{epoch.totalBlocks} </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </div>
);

export default createFragmentContainer(
  EpochCard,
  // Each key specified in this object will correspond to a prop available to the component
  {
    epoch: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment EpochCard_epoch on Epoch {
        id
        firstBlock {
          id
        }
        lastBlock {
          id
        }
        totalBlocks
      }
    `
  }
);
