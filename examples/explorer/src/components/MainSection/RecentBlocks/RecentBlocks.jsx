import { AllBlocksQuery } from '../../../graphql/queries';
import { RecentBlocksTable } from '../../Block';
import { QueryWrapper } from '../../QueryWrapper';

// Without this converter, RecentBlockTable can't parse the fragment for some reason
const propsConverter = props => ({ data: props });
const WrappedRecentBlocksTable = QueryWrapper(RecentBlocksTable, AllBlocksQuery, propsConverter);

export default WrappedRecentBlocksTable;
