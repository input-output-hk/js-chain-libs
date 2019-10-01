import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import Table from 'react-bootstrap/Table';
import BlockLink from '../../Commons/BlockLink/BlockLink';

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
          <td>
            <BlockLink chainLength={block.chainLength} />
          </td>
          <td>
            <BlockLink id={block.id} />
          </td>
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
