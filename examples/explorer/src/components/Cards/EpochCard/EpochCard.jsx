import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows information of current epoch */
const EpochCard = ({ epoch }) => (
  <Card>
    <Container>
      <Row>
        <h2 className="header"> Epoch </h2>
      </Row>
      <Row>
        <Col>Id:</Col>
        <Col>{epoch.id}</Col>
      </Row>
      <Row>
        <Col>First Block:</Col>
        <Col>{epoch.firstBlock.id}</Col>
      </Row>
      <Row>
        <Col>Last Block:</Col>
        <Col>{epoch.lastBlock.id}</Col>
      </Row>
      <Row>
        <Col>Total Blocks:</Col>
        <Col>{epoch.totalBlocks}</Col>
      </Row>
    </Container>
  </Card>
);

export default createFragmentContainer(
  EpochCard,
  // Each key specified in this object will correspond to a prop available to the component
  {
    epoch: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment EpochCard_epoch on Epoch {
        id
        firstBlock {
          id
        }
        lastBlock {
          id
        }
        totalBlocks
      }
    `
  }
);
