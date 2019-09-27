import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows the current fee information */
const FeeCard = ({ feeSettings }) => (
  <Card>
    <Container>
      <Row>
        <h2 className="header"> Fee information </h2>
      </Row>
      <Row>
        <Col>Constant:</Col>
        <Col> {feeSettings.constant} </Col>
      </Row>
      <Row>
        <Col>Coefficient:</Col>
        <Col> {feeSettings.constant} </Col>
      </Row>
    </Container>
  </Card>
);

export default createFragmentContainer(
  FeeCard,
  // Each key specified in this object will correspond to a prop available to the component
  {
    feeSettings: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment FeeCard_feeSettings on FeeSettings {
        constant
        coefficient
      }
    `
  }
);
