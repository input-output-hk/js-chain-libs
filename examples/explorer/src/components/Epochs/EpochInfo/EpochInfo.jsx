import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './epochInfo.scss';
import EmptyResult from '../../Commons/EmptyResult/EmptyResult';
import BlockTable from '../../Blocks/BlockTable/BlockTable';
import BlockLink from '../../Commons/BlockLink/BlockLink';
import EpochLink from '../../Commons/EpochLink/EpochLink';

const EpochInfo = ({ epoch }) => {
  if (!epoch) {
    return <EmptyResult {...{ entityName: 'Epoch' }} />;
  }
  const { blocks } = epoch;
  return (
    <div className="epochInfo">
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
              <td>
                <BlockLink id={epoch.firstBlock.id} />
              </td>
            </tr>
            <tr>
              <td>Last Block:</td>
              <td>
                <BlockLink id={epoch.lastBlock.id} />
              </td>
            </tr>
            <tr>
              <td>Blocks count:</td>
              <td>{epoch.totalBlocks}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <h3>Blocks</h3>
      {/* <BlockTable {...{ blocks }} /> */}
    </div>
  );
};

export default createFragmentContainer(
  EpochInfo,

  {
    epoch: graphql`
      fragment EpochInfo_epoch on Epoch {
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
