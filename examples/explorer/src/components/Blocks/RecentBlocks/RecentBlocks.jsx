import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../../graphql/environment';

import BlockTable from '../BlockTable/BlockTable';
import Loading from '../../Commons/Loading/Loading';

import './recentBlocks.scss';

const RecentBlocks = () => (
  <div className="recentBlocks">
    <h2 className="header"> Recent blocks </h2>
    <QueryRenderer
      environment={environment}
      query={graphql`
        query RecentBlocksQuery {
          recentBlocks {
            ...BlockTable_blocks
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

        return <BlockTable {...{ blocks: props.recentBlocks }} />;
      }}
    />
  </div>
);

export default RecentBlocks;
