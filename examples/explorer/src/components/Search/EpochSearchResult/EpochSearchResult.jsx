import graphql from 'babel-plugin-relay/macro';

import FullEpochInfo from '../../Epochs/FullEpochInfo/FullEpochInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const epochQuery = graphql`
  query EpochSearchResultQuery($id: EpochNumber!) {
    epoch(id: $id) {
      ...FullEpochInfo_epoch
    }
  }
`;

const EpochSearchResult = QueryWrapper(FullEpochInfo, epochQuery);

export default EpochSearchResult;
