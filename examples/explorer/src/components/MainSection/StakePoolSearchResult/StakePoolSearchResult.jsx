import { StakePoolSearchQuery } from '../../../graphql/queries';
import { FullStakePoolInfo } from '../../StakePool';
import { QueryWrapper } from '../../QueryWrapper';

const StakePoolSearchResult = QueryWrapper(FullStakePoolInfo, StakePoolSearchQuery);

export default StakePoolSearchResult;
