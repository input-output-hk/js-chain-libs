import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import BlockLink from '../../Commons/BlockLink/BlockLink';
import EpochLink from '../../Commons/EpochLink/EpochLink';

const orderBlocks = blocks => {
  return blocks.sort((b1, b2) => Number(b2.chainLength) - Number(b1.chainLength));
};

const BlockTable = ({ blocks }) => {
  const orderedBlocks = orderBlocks(blocks);
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Chain Length</th>
          <th>Hash</th>
          <th>Epoch</th>
          <th>Slot</th>
          <th>Tx count</th>
        </tr>
      </thead>
      <tbody>
        {orderedBlocks.map(block => (
          <tr>
            <td>
              <BlockLink chainLength={block.chainLength} />
            </td>
            <td>
              <BlockLink id={block.id} />
            </td>
            <td>
              <EpochLink number={block.date.epoch.id} />
            </td>
            <td>{block.date.slot}</td>
            <td>{block.transactions.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default createFragmentContainer(BlockTable, {
  blocks: graphql`
    fragment BlockTable_blocks on Block @relay(plural: true) {
      id
      date {
        epoch {
          id
        }
        slot
      }
      chainLength
      transactions {
        id
      }
    }
  `
});
