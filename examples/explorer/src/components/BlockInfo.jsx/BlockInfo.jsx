import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import Table from 'react-bootstrap/Table';

const BlockInfo = ({ block }) => (
  <Jumbotron>
    <div className="TransactionInfo">
      <h2>Block: {block.id}</h2>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Hash:</td>
            <td>{block.id}</td>
          </tr>
          <tr>
            <td>Epoch:</td>
            <td>{block.date.epoch.id}</td>
          </tr>
          <tr>
            <td>Slot:</td>
            <td>{block.date.slot}</td>
          </tr>
          <tr>
            <td>Chain length:</td>
            <td>{block.chainLength}</td>
          </tr>
          <tr>
            <td>Previous block:</td>
            <td>{block.previousBlock.id}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </Jumbotron>
);

export default createFragmentContainer(
  BlockInfo,
  // Each key specified in this object will correspond to a prop available to the component
  {
    block: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment BlockInfo_block on Block {
        id
        date {
          epoch {
            id
          }
          slot
        }
        chainLength
        previousBlock {
          id
        }
      }
    `
  }
);
