import React from 'react';

import '../statusCard.scss';
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows information of current epoch */
const EpochCard = ({ epoch }) => (
  <div className="statusCard">
    <div>Current Epoch: {epoch.id}</div>
  </div>
);

export default createFragmentContainer(
  EpochCard,
  // Each key specified in this object will correspond to a prop available to the component
  {
    epoch: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment EpochCard_epoch on Epoch {
        id
      }
    `
  }
);
