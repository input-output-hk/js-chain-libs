import React from 'react';

import graphql from 'babel-plugin-relay/macro';

import BlockTable from '../BlockTable/BlockTable';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

import './recentBlocks.scss';

/** Getting Last blocks  */
const recentBlocksQuery = graphql`
  query RecentBlocksQuery($last: Int!) {
    ...BlockTable_data @arguments(last: $last)
  }
`;

const propsConverter = props => ({ data: props });
const WrappedBlockTable = QueryWrapper(BlockTable, recentBlocksQuery, propsConverter);

const RecentBlocks = () => (
  <div className="recentBlocks">
    <h2> Recent blocks </h2>
    <WrappedBlockTable last={10} />
  </div>
);

export default RecentBlocks;
