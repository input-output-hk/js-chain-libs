import graphql from 'babel-plugin-relay/macro';

const stakePoolSearchQuery = graphql`
  query stakePoolSearchQuery($id: PoolId!) {
    stakePool(id: $id) {
      ...FullStakePoolInfo_stakePool
    }
  }
`;

export default stakePoolSearchQuery;
