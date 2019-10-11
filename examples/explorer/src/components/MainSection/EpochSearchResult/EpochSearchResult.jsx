import { EpochSearchQuery } from '../../../graphql/queries';
import { FullEpochInfo } from '../../Epoch';
import { QueryWrapper } from '../../QueryWrapper';

const EpochSearchResult = QueryWrapper(FullEpochInfo, EpochSearchQuery);

export default EpochSearchResult;
