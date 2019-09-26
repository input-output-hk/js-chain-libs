import React from 'react';
import BlockTable from "../BlockTable/BlockTable";
import Jumbotron from "react-bootstrap/Jumbotron";

/** Shows the last N blocks in a paginated table */
const RecentBlocks = () => {
  return (
    <Jumbotron>
      <h2 className="header"> Recent blocks </h2>
      <BlockTable/>
    </Jumbotron>
  );
}

export default RecentBlocks;
