import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../../graphql/environment';
import StatusInfo from '../StatusInfo/StatusInfo';
import Loading from '../../Commons/Loading/Loading';
import ErrorResult from '../../Commons/ErrorResult/ErrorResult';

/** Wraps Status component with GraphQl data */
const StatusBar = () => (
  <QueryRenderer
    environment={environment}
    query={graphql`
      query StatusBarQuery {
        status {
          ...StatusInfo_status
        }
      }
    `}
    variables={{}}
    render={response => {
      const { error, props } = response;
      if (error) {
        return <ErrorResult />;
      }
      if (!props) {
        return <Loading />;
      }

      return <StatusInfo {...props} />;
    }}
  />
);

export default StatusBar;
