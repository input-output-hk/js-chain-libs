import React from 'react';
import { Link } from '@reach/router';

import '../../../generalStyling.scss';

const BlockLink = ({ id, chainLength }) => {
  if (id) {
    return (
      <Link className="basicLink" to={`/block/${id}`}>
        {id}
      </Link>
    );
  }
  return (
    <Link className="basicLink" to={`/block/chainLength/${chainLength}`}>
      {chainLength}
    </Link>
  );
};

export default BlockLink;
