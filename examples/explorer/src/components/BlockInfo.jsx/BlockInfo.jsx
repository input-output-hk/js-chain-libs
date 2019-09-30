import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './blockInfo.scss';
import EmptyResult from '../commons/EmptyResult/EmptyResult';
import TransactionTable from '../TransactionTable/TransactionTable';

const BlockInfo = ({ block }) => {
  if (!block) {
    return <EmptyResult {...{ entityName: 'Block' }} />;
  }
  const { transactions } = block;

  return (
    <Jumbotron>
      <div className="blockInfo">
        <h2>Block: {block.id}</h2>
        <div className="blockInfoContainer">
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

        <div className="blockInfoContainer">
          <TransactionTable {...{ transactions }} />
        </div>
      </div>
    </Jumbotron>
  );
};

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
        transactions {
          ...TransactionTable_transactions
        }
      }
    `
  }
);
