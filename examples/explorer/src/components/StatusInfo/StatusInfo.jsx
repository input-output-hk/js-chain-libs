import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './statusInfo.scss';
import CardGroup from 'react-bootstrap/CardGroup';
import BlockCard from '../Cards/BlockCard/BlockCard';
import EpochCard from '../Cards/EpochCard/EpochCard';
import FeeCard from '../Cards/FeeCard/FeeCard';

/** Shows general Status of current network */
const StatusInfo = ({ status }) => {
  const { currentEpoch, latestBlock, feeSettings } = status;
  return (
    <div className="CardsContainer">
      <EpochCard {...{ epoch: currentEpoch }} />
      <BlockCard {...{ block: latestBlock }} />
      <FeeCard {...{ feeSettings }} />
    </div>
  );
};

export default createFragmentContainer(
  StatusInfo,
  // Each key specified in this object will correspond to a prop available to the component
  {
    status: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
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
