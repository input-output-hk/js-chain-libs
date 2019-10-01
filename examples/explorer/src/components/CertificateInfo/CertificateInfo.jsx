import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import OwnerStakeDelegation from '../OwnerStakeDelegation/OwnerStakeDelegation';
import StakeDelegation from '../StakeDelegation/StakeDelegation';
import PoolRegistration from '../PoolRegistration/PoolRegistration';
import UnknownCertificate from '../UnknownCertificate/UnknownCertificate';

const CertificateInfo = ({ certificate }) => {
  switch (certificate.__typename) {
    case 'OwnerStakeDelegation':
      return <OwnerStakeDelegation {...{ certificate }} />;
    case 'StakeDelegation':
      return <StakeDelegation {...{ certificate }} />;
    case 'PoolRegistration':
      return <PoolRegistration {...{ certificate }} />;
    default:
      return <UnknownCertificate />;
  }
};

export default createFragmentContainer(
  CertificateInfo,
  // Each key specified in this object will correspond to a prop available to the component
  {
    certificate: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment CertificateInfo_certificate on Certificate {
        __typename
        ... on OwnerStakeDelegation {
          ...OwnerStakeDelegation_certificate
        }
        ... on StakeDelegation {
          ...StakeDelegation_certificate
        }
        ... on PoolRegistration {
          ...PoolRegistration_certificate
        }
      }
    `
  }
);
