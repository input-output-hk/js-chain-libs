import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import OwnerStakeDelegation from '../OwnerStakeDelegation/OwnerStakeDelegation';
import StakeDelegation from '../StakeDelegation/StakeDelegation';
import PoolRegistration from '../PoolRegistration/PoolRegistration';
import UnknownCertificate from '../UnknownCertificate/UnknownCertificate';

import './certificateInfo.scss';

const certificateComponent = certificate => {
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

const CertificateInfo = ({ certificate }) => {
  if (certificate) {
    return (
      <div className="certificateInfo">
        <h3> Certificate </h3>
        {certificateComponent(certificate)}
      </div>
    );
  }
  return null;
};

export default createFragmentContainer(
  CertificateInfo,
  
  {
    certificate: graphql`
      
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
