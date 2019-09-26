import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import BlockTable from '../BlockTable/BlockTable';

/** Shows the last N blocks in a paginated table */
const RecentBlocks = () => (
  <Jumbotron>
    <h2 className="header"> Recent blocks </h2>
    <BlockTable />
  </Jumbotron>
);

export default RecentBlocks;
