import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../graphql/environment';

import BlockTable from '../BlockTable/BlockTable';
import Loading from '../Loading/Loading';

/** TODO: Refactor this component extracting QueryRenderer
 *        Create Query for getting recent blocks
 *
 */
const RecentBlocks = () => (
  <Jumbotron>
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
  </Jumbotron>
);

export default RecentBlocks;
