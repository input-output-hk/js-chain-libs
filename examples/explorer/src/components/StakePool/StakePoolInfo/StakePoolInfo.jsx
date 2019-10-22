import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { EmptyResult, CopiableItem } from '../../Commons';

const StakePoolInfo = ({ stakePool }) => {
  if (!stakePool) {
    return <EmptyResult {...{ entityName: 'StakePool' }} />;
  }

  return (
    <div className="entityInfoTable">
      <h2>Stake Pool</h2>
      <div className="keyValueTable">
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td>Id:</td>
              <td>
                <CopiableItem text={stakePool.id} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default createFragmentContainer(StakePoolInfo, {
  stakePool: graphql`
    fragment StakePoolInfo_stakePool on Pool {
      id
    }
  `
});
