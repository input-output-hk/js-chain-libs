import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

const CertificateSearchResult = ({ id }) => (
  <Jumbotron>
    <Container>
      <h1> Here it is... the certificate you have been looking for: {id}</h1>
    </Container>
  </Jumbotron>
);

export default CertificateSearchResult;
