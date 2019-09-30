import React from 'react';
import { Link } from '@reach/router';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import Table from 'react-bootstrap/Table';

const BlockTable = ({ blocks }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Chain Length</th>
        <th>Hash</th>
        <th>Epoch</th>
        <th>Slot</th>
      </tr>
    </thead>
    <tbody>
      {blocks.map(block => (
        <tr>
          <td>{block.chainLength}</td>
          <td>{block.id}</td>
          <td>{block.date.epoch.id}</td>
          <td>{block.date.slot}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default createFragmentContainer(
  BlockTable,
  // Each key specified in this object will correspond to a prop available to the component
  {
    blocks: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment BlockTable_blocks on Block @relay(plural: true) {
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
