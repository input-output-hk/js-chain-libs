import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

const OwnerStakeDelegation = ({ certificate }) => {
  return (
    <div className="ownerStakeDelegation">
      <h3>OwnerStakeDelegation Certificate</h3>
    </div>
  );
};

export default createFragmentContainer(
  OwnerStakeDelegation,
  // Each key specified in this object will correspond to a prop available to the component
  {
    certificate: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment OwnerStakeDelegation_certificate on OwnerStakeDelegation {
        pool {
          id
        }
      }
    `
  }
);
