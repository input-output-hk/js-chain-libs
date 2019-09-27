import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

/** Shows information of las block */
const BlockCard = ({ block }) => (
  <Card>
    <Container>
      <Row>
        <h2 className="header"> Last Block </h2>
      </Row>
      <Row>
        <Col>Hash:</Col>
        <Col>{block.id}</Col>
      </Row>
      <Row>
        <Col>Chain length:</Col>
        <Col>{block.chainLength}</Col>
      </Row>
    </Container>
  </Card>
);

export default createFragmentContainer(
  BlockCard,
  // Each key specified in this object will correspond to a prop available to the component
  {
    block: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment BlockCard_block on Block {
        id
        chainLength
      }
    `
  }
);
