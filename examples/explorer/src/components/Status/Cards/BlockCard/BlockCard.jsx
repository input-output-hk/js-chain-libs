import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

import '../statusCard.scss';
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows information of las block */
const BlockCard = ({ block }) => (
  <div className="statusCard">
    <Card>
      <Card.Header as="h5">Last Block</Card.Header>
      <Card.Body>
        <Table borderless>
          <tbody>
            <tr>
              <td>Hash:</td>
              <td>{block.id}</td>
            </tr>
            <tr>
              <td>Chain length:</td>
              <td>{block.chainLength} </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  </div>
);

export default createFragmentContainer(
  BlockCard,
  
  {
    block: graphql`
      
      fragment BlockCard_block on Block {
        id
        chainLength
      }
    `
  }
);
