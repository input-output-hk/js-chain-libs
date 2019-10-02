import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../../graphql/environment';
import BlockInfo from '../../Blocks/BlockInfo/BlockInfo';
import Loading from '../../Commons/Loading/Loading';
import EmptyResult from '../../Commons/EmptyResult/EmptyResult';

import '../../generalStyling.scss';

const BlockByLengthSearchResult = ({ length }) => (
  <QueryRenderer
    className="queryResult"
    environment={environment}
    query={graphql`
      query BlockByLengthSearchResultQuery($length: ChainLength!) {
        blockByChainLength(length: $length) {
          ...BlockInfo_block
        }
      }
    `}
    variables={{ length }}
    render={response => {
      const { error, props } = response;
      if (error) {
        return <EmptyResult />;
      }
      if (!props) {
        return <Loading />;
      }

      return <BlockInfo {...{ block: props.blockByChainLength }} />;
    }}
  />
);

export default BlockByLengthSearchResult;
