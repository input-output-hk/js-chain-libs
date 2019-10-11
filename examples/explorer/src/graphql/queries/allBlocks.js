import graphql from 'babel-plugin-relay/macro';

const allBlocksQuery = graphql`
  query allBlocksQuery {
    ...RecentBlocksTable_data
  }
`;
export default allBlocksQuery;
