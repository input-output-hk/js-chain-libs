import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

const StakeDelegation = ({ certificate }) => {
  return (
    <div className="stakeDelegation">
      <h3>StakeDelegation Certificate</h3>
    </div>
  );
};

export default createFragmentContainer(
  StakeDelegation,
  // Each key specified in this object will correspond to a prop available to the component
  {
    certificate: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment StakeDelegation_certificate on StakeDelegation {
        account {
          id
        }
        pool {
          id
        }
      }
    `
  }
);
