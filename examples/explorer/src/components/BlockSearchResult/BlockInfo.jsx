import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

const BlockInfo = ({ block }) => (
  <Jumbotron>
    <Container>
      <h1> Here it is... the block you have been looking for: {block.id}</h1>
    </Container>
  </Jumbotron>
);

export default createFragmentContainer(
  BlockInfo,
  // Each key specified in this object will correspond to a prop available to the component
  {
    block: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment BlockInfo_block on Block {
        id
      }
    `
  }
);
