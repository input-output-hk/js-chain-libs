import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import {
  CopiableItem,
  BlockLink,
  EpochLink,
  NextPrev,
  BlockDateTime,
  StakePoolLink
} from '../../Commons';
import { getNextPrev } from '../../../helpers/blockHelper';

const BlockInfo = ({ block }) => {
  const baseUrl = '/block/chainLength/';

  return (
    <div className="entityInfoTable">
      <NextPrev {...{ baseUrl, element: block, getNextPrev }} />
      <h2>Block</h2>
      <div className="keyValueTable">
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td>Hash:</td>
              <td>
                <CopiableItem text={block.id} />
              </td>
            </tr>
            <tr>
              <td>Epoch:</td>
              <td>
                <EpochLink number={block.date.epoch.id} />
              </td>
            </tr>
            <tr>
              <td>Slot:</td>
              <td>{block.date.slot}</td>
            </tr>
            <tr>
              <td>Date:</td>
              <td>
                <BlockDateTime blockDate={block.date} />
              </td>
            </tr>
            <tr>
              <td>Chain length:</td>
              <td>
                <BlockLink chainLength={block.chainLength} />
              </td>
            </tr>
            <tr>
              <td>Leader:</td>
              <td>{block.leader && <StakePoolLink id={block.leader.id} />}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default createFragmentContainer(BlockInfo, {
  block: graphql`
    fragment BlockInfo_block on Block {
      id
      date {
        epoch {
          id
        }
        slot
        ...BlockDateTime_blockDate
      }
      chainLength
      previousBlock {
        id
      }
      leader {
        ... on Pool {
          id
        }
      }
    }
  `
});
