import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows information of las block */
const BlockCard = ({ block }) => (
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
);

export default createFragmentContainer(
  BlockCard,
  // Each key specified in this object will correspond to a prop available to the component
  {
    block: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment BlockCard_block on Block {
        id
        chainLength
      }
    `
  }
);
