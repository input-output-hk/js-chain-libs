import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const BlockInfo = ({hash,height}) => (
    <Container>
      <Row>
        <h1 className="header"> I'm a Block!</h1>
      </Row>
      <Row></Row>
    </Container>
)

export default BlockInfo;