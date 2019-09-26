import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

/** Shows general Status of current network */
const Status = () => (
  <Container>
    <Row>
      <Col>
        <Card>
          <h2 className="header"> Last epoch </h2>
        </Card>
      </Col>
      <Col>
        <Card>
          <h2 className="header"> Tip </h2>
        </Card>
      </Col>
      <Col>
        <Card>
          <h2 className="header"> Current fee </h2>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Status;
