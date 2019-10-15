import graphql from 'babel-plugin-relay/macro';

const statusQuery = graphql`
  query statusQuery {
    status {
      ...StatusInfo_status
    }
  }
`;

export default statusQuery;
