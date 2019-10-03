import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../../graphql/environment';
import AddressInfo from '../../Addresses/AddressInfo/AddressInfo';
import Loading from '../../Commons/Loading/Loading';
import ErrorResult from '../../Commons/ErrorResult/ErrorResult';

import '../../generalStyling.scss';

const AddressSearchResult = ({ id }) => (
  <QueryRenderer
    className="queryResult"
    environment={environment}
    query={graphql`
      query AddressSearchResultQuery($bech32: String!) {
        address(bech32: $bech32) {
          ...AddressInfo_address
        }
      }
    `}
    variables={{ bech32: id }}
    render={response => {
      const { error, props } = response;
      if (error) {
        return <ErrorResult />;
      }
      if (!props) {
        return <Loading />;
      }

      return <AddressInfo {...props} />;
    }}
  />
);

export default AddressSearchResult;
