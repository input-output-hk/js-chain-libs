import graphql from 'babel-plugin-relay/macro';

import EpochInfo from '../../Epochs/EpochInfo/EpochInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const epochQuery = graphql`
  query EpochSearchResultQuery($id: EpochNumber!) {
    epoch(id: $id) {
      ...EpochInfo_epoch
    }
  }
`;

const EpochSearchResult = QueryWrapper(EpochInfo, epochQuery);

export default EpochSearchResult;
