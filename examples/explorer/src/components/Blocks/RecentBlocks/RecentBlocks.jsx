import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createRefetchContainer } from 'react-relay';

import BlockPagedTable from '../BlockPagedTable/BlockPagedTable';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

import './recentBlocks.scss';

const FinalBlockPagedTable = createRefetchContainer(
  BlockPagedTable,
  {
    data: graphql`
      fragment RecentBlocks_data on Query
        @argumentDefinitions(
          first: { type: "Int" }
          last: { type: "Int" }
          after: { type: "BlockCursor" }
          before: { type: "BlockCursor" }
        ) {
        blocks: allBlocks(first: $first, last: $last, after: $after, before: $before) {
          edges {
            cursor
            node {
              ...BlockTable_blocks
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
          totalCount
        }
      }
    `
  },
  graphql`
    query RecentBlocksRefetchQuery(
      $first: Int
      $last: Int
      $after: BlockCursor
      $before: BlockCursor
    ) {
      ...RecentBlocks_data @arguments(first: $first, last: $last, after: $after, before: $before)
    }
  `
);

const allBlocksQuery = graphql`
  query RecentBlocksQuery($last: Int!) {
    ...RecentBlocks_data @arguments(last: $last)
  }
`;

const propsConverter = props => ({ data: props });
const WrappedBlockTable = QueryWrapper(FinalBlockPagedTable, allBlocksQuery, propsConverter);

const RecentBlocks = () => (
  <div className="recentBlocks">
    <h2> Recent blocks </h2>
    <WrappedBlockTable last={10} />
  </div>
);

export default RecentBlocks;
