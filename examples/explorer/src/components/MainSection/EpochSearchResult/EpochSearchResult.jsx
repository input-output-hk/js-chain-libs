import graphql from 'babel-plugin-relay/macro';

import { FullEpochInfo } from '../../Epoch';
import { QueryWrapper } from '../../QueryWrapper';

const epochQuery = graphql`
  query EpochSearchResultQuery($id: EpochNumber!) {
    epoch(id: $id) {
      ...FullEpochInfo_epoch
    }
  }
`;

const EpochSearchResult = QueryWrapper(FullEpochInfo, epochQuery);

export default EpochSearchResult;
