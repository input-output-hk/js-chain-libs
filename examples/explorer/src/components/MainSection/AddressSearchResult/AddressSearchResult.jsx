import { FullAddressInfo } from '../../Address';
import { QueryWrapper } from '../../QueryWrapper';
import { AddressSearchQuery } from '../../../graphql/queries';

const AddressSearchResult = QueryWrapper(FullAddressInfo, AddressSearchQuery);

export default AddressSearchResult;
