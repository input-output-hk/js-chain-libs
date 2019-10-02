import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

const PoolRegistration = ({ certificate }) => {
  return (
    <div className="poolRegistration">
      <h3>PoolRegistration Certificate</h3>
    </div>
  );
};

export default createFragmentContainer(
  PoolRegistration,
  // Each key specified in this object will correspond to a prop available to the component
  {
    certificate: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment PoolRegistration_certificate on PoolRegistration {
        pool {
          id
        }
        serial
        startValidity
        managementThreshold
        owners
      }
    `
  }
);
