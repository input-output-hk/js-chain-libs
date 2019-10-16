import graphql from 'babel-plugin-relay/macro';

import StatusInfo from '../StatusInfo/StatusInfo';
import { QueryWrapper } from '../../QueryWrapper';

const statusQuery = graphql`
  query StatusBarQuery {
    status {
      ...StatusInfo_status
    }
  }
`;

const StatusBar = QueryWrapper(StatusInfo, statusQuery);

export default StatusBar;
