import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './statusInfo.scss';
import BlockCard from '../Cards/BlockCard/BlockCard';
import EpochCard from '../Cards/EpochCard/EpochCard';
import FeeCard from '../Cards/FeeCard/FeeCard';

/** Shows general Status of current network */
const StatusInfo = ({ status }) => {
  const { currentEpoch, latestBlock, feeSettings } = status;
  return (
    <div className="cardsContainer">
      <EpochCard {...{ epoch: currentEpoch }} />
      <BlockCard {...{ block: latestBlock }} />
      <FeeCard {...{ feeSettings }} />
    </div>
  );
};

export default createFragmentContainer(
  StatusInfo,
  
  {
    status: graphql`
      
      fragment StatusInfo_status on Status {
        currentEpoch {
          ...EpochCard_epoch
        }
        latestBlock {
          ...BlockCard_block
        }
        feeSettings {
          ...FeeCard_feeSettings
        }
      }
    `
  }
);
