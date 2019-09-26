import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";


const TransactionDetail = ({txHash, block}) => (  
  <Container>
    <Row>
      <h2 className="header"> Tx hash: {txHash}</h2>
    </Row>
    <Row>
      <h2 className="header"> Block Number: {txHash}</h2>
    </Row>
  </Container>
);

const TransactionInfo = ({txHash, block}) => (
  <Container>
    <Row>
      <h1 className="header"> I'm a Transaction!</h1>
    </Row>
    <TransactionDetail/>
  </Container>
)

export default TransactionInfo;