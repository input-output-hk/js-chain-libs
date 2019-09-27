import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import BlockCard from '../Cards/BlockCard/BlockCard';
import EpochCard from '../Cards/EpochCard/EpochCard';
import FeeCard from '../Cards/FeeCard/FeeCard';

/** Shows general Status of current network */
const Status = ({ status }) => {
  const { currentEpoch, latestBlock, feeSettings } = status;
  return (
    <Container>
      <Row>
        <Col>
          <EpochCard {...{ epoch: currentEpoch }} />
        </Col>
        <Col>
          <BlockCard {...{ block: latestBlock }} />
        </Col>
        <Col>
          <FeeCard {...{ feeSettings }} />
        </Col>
      </Row>
    </Container>
  );
};

export default createFragmentContainer(
  Status,
  // Each key specified in this object will correspond to a prop available to the component
  {
    status: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment Status_status on Status {
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
