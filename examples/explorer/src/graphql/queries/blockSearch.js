import graphql from 'babel-plugin-relay/macro';

const blockQuery = graphql`
  query blockSearchResultQuery($id: String!) {
    block(id: $id) {
      ...FullBlockInfo_block
    }
  }
`;

export default blockQuery;
