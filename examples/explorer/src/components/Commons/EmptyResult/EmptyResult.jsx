import React from 'react';
import Card from 'react-bootstrap/Card';

// TODO: improve this component
const EmptyResult = entityName => (
  <Card bg="danger" text="white">
    <h4> Not found</h4>
  </Card>
);

export default EmptyResult;
