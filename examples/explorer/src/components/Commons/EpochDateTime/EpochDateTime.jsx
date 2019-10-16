import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import DateTime from '../DateTime/DateTime';
import { timestampFromEpoch } from '../../../helpers/datetimeHelper';

const EpochDateTime = ({ epoch }) => {
  const timestamp = timestampFromEpoch(epoch);

  return <DateTime {...{ timestamp }} />;
};

export default createFragmentContainer(EpochDateTime, {
  epoch: graphql`
    fragment EpochDateTime_epoch on Epoch {
      id
    }
  `
});
