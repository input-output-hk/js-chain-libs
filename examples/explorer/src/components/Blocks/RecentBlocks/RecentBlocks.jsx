import React from 'react';

import graphql from 'babel-plugin-relay/macro';

import BlockTable from '../../Blocks/BlockTable/BlockTable';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

import './recentBlocks.scss';

/** Getting Last blocks  */
const recentBlocksQuery = graphql`
  query RecentBlocksQuery {
    recentBlocks {
      ...BlockTable_blocks
    }
  }
`;

const propsConverter = props => ({ blocks: props.recentBlocks });
const WrappedBlockTable = QueryWrapper(BlockTable, recentBlocksQuery, propsConverter);

const RecentBlocks = () => (
  <div className="recentBlocks">
    <h2> Recent blocks </h2>
    <WrappedBlockTable />
  </div>
);

export default RecentBlocks;
