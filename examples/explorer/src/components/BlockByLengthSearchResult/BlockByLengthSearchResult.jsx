import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../graphql/environment';
import BlockInfo from '../BlockInfo.jsx/BlockInfo';
import Loading from '../commons/Loading/Loading';

const BlockByLengthSearchResult = ({ length }) => (
  <QueryRenderer
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
        return <div>Error!</div>;
      }
      if (!props) {
        return <Loading />;
      }

      return <BlockInfo {...{ block: props.blockByChainLength }} />;
    }}
  />
);

export default BlockByLengthSearchResult;
