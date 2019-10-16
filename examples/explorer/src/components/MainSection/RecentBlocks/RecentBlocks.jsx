import graphql from 'babel-plugin-relay/macro';

import { RecentBlocksTable } from '../../Block';
import { QueryWrapper } from '../../QueryWrapper';

const allBlocksQuery = graphql`
  query RecentBlocksQuery {
    ...RecentBlocksTable_data
  }
`;

// Without this converter, RecentBlockTable can't parse the fragment for some reason
const propsConverter = props => ({ data: props });
const WrappedRecentBlocksTable = QueryWrapper(RecentBlocksTable, allBlocksQuery, propsConverter);

export default WrappedRecentBlocksTable;
