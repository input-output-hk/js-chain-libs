import { StatusQuery } from '../../../graphql/queries';

import StatusInfo from '../StatusInfo/StatusInfo';
import { QueryWrapper } from '../../QueryWrapper';

const StatusBar = QueryWrapper(StatusInfo, StatusQuery);

export default StatusBar;
