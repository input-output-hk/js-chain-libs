import graphql from 'babel-plugin-relay/macro';

const lastBlockQuery = graphql`
  query lastBlockQuery {
    status {
      latestBlock {
        chainLength
      }
    }
  }
`;

export default lastBlockQuery;
