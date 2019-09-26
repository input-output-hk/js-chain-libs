import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

/** Shows the last N blocks in a paginated table */
const Status = () => {
  return (
    <Jumbotron>
      <h2 className="header"> Recent blocks </h2>
      <BlockTable/>
    </Jumbotron>
  );
}

export default Status;
