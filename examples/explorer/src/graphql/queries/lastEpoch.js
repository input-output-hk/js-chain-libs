import graphql from 'babel-plugin-relay/macro';

const lastEpochQuery = graphql`
  query lastEpochQuery {
    status {
      latestBlock {
        date {
          epoch {
            id
          }
        }
      }
    }
  }
`;

export default lastEpochQuery;
