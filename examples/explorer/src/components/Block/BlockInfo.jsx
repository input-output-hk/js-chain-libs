import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const BlockInfo = ({ hash, height }) => (
  <Container>
    <Row>
      <h1 className="header"> Im a Block!</h1>
    </Row>
    <Row />
  </Container>
);

export default BlockInfo;
