import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import DateTime from '../DateTime/DateTime';
import { timestampFromBlockDate } from '../../../helpers/datetimeHelper';

const BlockDateTime = ({ blockDate }) => {
  const timestamp = timestampFromBlockDate(blockDate);

  return <DateTime {...{ timestamp }} />;
};

export default createFragmentContainer(BlockDateTime, {
  blockDate: graphql`
    fragment BlockDateTime_blockDate on BlockDate {
      epoch {
        id
      }
      slot
    }
  `
});
