import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './blockInfo.scss';
import EmptyResult from '../../Commons/EmptyResult/EmptyResult';
import TransactionTable from '../../Transactions/TransactionTable/TransactionTable';
import BlockLink from '../../Commons/BlockLink/BlockLink';

const BlockInfo = ({ block }) => {
  if (!block) {
    return <EmptyResult {...{ entityName: 'Block' }} />;
  }
  const { transactions } = block;

  return (
    <div className="blockInfo">
      <div className="header">
        <h2>Block</h2>
      </div>
      <div className="keyValueTable">
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td>Hash:</td>
              <td>
                <BlockLink id={block.id} />
              </td>
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
              <td>
                <BlockLink id={block.previousBlock.id} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <h3>Transactions</h3>
      <div className="transactionsInfoContainer">
        <TransactionTable {...{ transactions }} />
      </div>
    </div>
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
