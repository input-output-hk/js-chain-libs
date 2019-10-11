import graphql from 'babel-plugin-relay/macro';

const addressQuery = graphql`
  query addressSearchQuery($bech32: String!) {
    address(bech32: $bech32) {
      ...FullAddressInfo_address
    }
  }
`;

export default addressQuery;
