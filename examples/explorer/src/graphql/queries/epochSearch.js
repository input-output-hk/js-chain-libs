import graphql from 'babel-plugin-relay/macro';

const epochQuery = graphql`
  query epochSearchResultQuery($id: EpochNumber!) {
    epoch(id: $id) {
      ...FullEpochInfo_epoch
    }
  }
`;

export default epochQuery;
