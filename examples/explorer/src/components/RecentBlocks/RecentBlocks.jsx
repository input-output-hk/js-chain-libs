import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';
import environment from '../../graphql/environment';

import BlockTable from '../BlockTable/BlockTable';
import Loading from '../Loading/Loading';

/** TODO: Refactor this component extracting QueryRenderer
 *        Create Query for getting more than one block
 *
 */
const RecentBlocks = () => (
  <Jumbotron>
    <h2 className="header"> Recent blocks </h2>
    {/* <QueryRenderer
      environment={environment}
      query={graphql`
        query RecentBlocksQuery($id: String!) {
          recentBlocks() {
            id
            ...BlockInfo_block
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

        return <BlockTable {...props} />;
      }}
    /> */}
  </Jumbotron>
);

export default RecentBlocks;
