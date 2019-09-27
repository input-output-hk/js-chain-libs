import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../graphql/environment';
import Status from './Status';
import Loading from '../Loading/Loading';

/** Wraps Status component with GraphQl data */
const StatusWrapper = () => (
  <QueryRenderer
    environment={environment}
    query={graphql`
      query StatusWrapperQuery {
        status {
          ...Status_status
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
        return <Loading />;
      }

      return <Status {...props} />;
    }}
  />
);

export default StatusWrapper;
