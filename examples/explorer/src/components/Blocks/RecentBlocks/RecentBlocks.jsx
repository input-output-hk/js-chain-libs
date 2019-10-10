import graphql from 'babel-plugin-relay/macro';

import RecentBlocksTable from '../RecentBlocksTable/RecentBlocksTable';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

import './recentBlocks.scss';

const allBlocksQuery = graphql`
  query RecentBlocksQuery {
    ...RecentBlocksTable_data
  }
`;

// Without this converter, RecentBlockTable can't parse the fragment for some reason
const propsConverter = props => ({ data: props });
const WrappedRecentBlocksTable = QueryWrapper(RecentBlocksTable, allBlocksQuery, propsConverter);

export default WrappedRecentBlocksTable;
