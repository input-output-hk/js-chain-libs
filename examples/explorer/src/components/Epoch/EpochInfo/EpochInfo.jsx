import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { EmptyResult, BlockLink, EpochLink } from '../../Commons';

const EpochInfo = ({ epoch }) => {
  if (!epoch) {
    return <EmptyResult {...{ entityName: 'Epoch' }} />;
  }
  const { firstBlock, lastBlock } = epoch;

  return (
    <div className="entityInfoTable">
      <h2>Epoch</h2>

      <div className="keyValueTable">
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Epoch Number:</td>
              <td>
                <EpochLink number={epoch.id} />
              </td>
            </tr>
            <tr>
              <td>First Block:</td>
              <td>{firstBlock && <BlockLink id={firstBlock.id} />}</td>
            </tr>
            <tr>
              <td>Last Block:</td>
              <td>{lastBlock && <BlockLink id={lastBlock.id} />}</td>
            </tr>
            <tr>
              <td>Blocks count:</td>
              <td>{epoch.totalBlocks}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default createFragmentContainer(EpochInfo, {
  epoch: graphql`
    fragment EpochInfo_epoch on Epoch
      @argumentDefinitions(
        first: { type: "Int" }
        last: { type: "Int" }
        after: { type: "BlockCursor" }
        before: { type: "BlockCursor" }
      ) {
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
});
