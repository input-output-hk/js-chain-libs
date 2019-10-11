import graphql from 'babel-plugin-relay/macro';

const lastBlockQuery = graphql`
  query LastBlockQuery {
    status {
      latestBlock {
        chainLength
      }
    }
  }
`;

export default lastBlockQuery;
