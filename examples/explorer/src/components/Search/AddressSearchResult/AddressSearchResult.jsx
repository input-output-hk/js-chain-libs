import graphql from 'babel-plugin-relay/macro';

import FullAddressInfo from '../../Addresses/FullAddressInfo/FullAddressInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const addressQuery = graphql`
  query AddressSearchResultQuery($bech32: String!) {
    address(bech32: $bech32) {
      ...FullAddressInfo_address
    }
  }
`;

const AddressSearchResult = QueryWrapper(FullAddressInfo, addressQuery);

export default AddressSearchResult;
