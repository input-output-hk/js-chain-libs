import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../../graphql/environment';
import TransactionInfo from '../../Transactions/TransactionInfo/TransactionInfo';
import Loading from '../../Commons/Loading/Loading';

import '../../generalStyling.scss';

const TransactionSearchResult = ({ id }) => (
  <QueryRenderer
    className="queryResult"
    environment={environment}
    query={graphql`
      query TransactionSearchResultQuery($id: String!) {
        transaction(id: $id) {
          id
          ...TransactionInfo_transaction
        }
      }
    `}
    variables={{ id }}
    render={response => {
      const { error, props } = response;
      if (error) {
        return <div>Error!</div>;
      }
      if (!props) {
        return <Loading />;
      }

      return <TransactionInfo {...props} />;
    }}
  />
);

export default TransactionSearchResult;
