import graphql from 'babel-plugin-relay/macro';

import AddressInfo from '../../Addresses/AddressInfo/AddressInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const addressQuery = graphql`
  query AddressSearchResultQuery($bech32: String!) {
    address(bech32: $bech32) {
      ...AddressInfo_address
    }
  }
`;

const AddressSearchResult = QueryWrapper(AddressInfo, addressQuery);

export default AddressSearchResult;
