import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../graphql/environment';
import BlockTable from './BlockTable';

/** Wraps Status component with GraphQl data */
const BlockTableWrapper = () => (
  <QueryRenderer
    environment={environment}
    query={graphql`
      query BlockTableWrapperQuery {
        status {
          latestBlock {
            id
            chainLength
          }
        }
      }
    `}
    variables={{}}
    render={response => {
      const { error, props } = response;
      if (error) {
        return <div>Error!</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }

      return <BlockTable {...props} />;
    }}
  />
);

export default BlockTableWrapper;
