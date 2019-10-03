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
  
  {
    epoch: graphql`
      
      fragment EpochCard_epoch on Epoch {
        id
      }
    `
  }
);
