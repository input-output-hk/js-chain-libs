import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import StakePoolInfo from '../StakePoolInfo/StakePoolInfo';
import StakePoolBlockTable from '../StakePoolBlockTable/StakePoolBlockTable';
import { EmptyResult } from '../../Commons';

const FullStakePoolInfo = ({ stakePool }) => {
  if (!stakePool) {
    return <EmptyResult {...{ entityName: 'Epoch' }} />;
  }

  return (
    <div className="entityInfoContainer">
      <StakePoolInfo {...{ stakePool }} />
      <StakePoolBlockTable {...{ stakePool }} />
    </div>
  );
};

export default createFragmentContainer(FullStakePoolInfo, {
  stakePool: graphql`
    fragment FullStakePoolInfo_stakePool on Pool {
      ...StakePoolInfo_stakePool
      ...StakePoolBlockTable_stakePool @arguments(last: 10)
    }
  `
});
