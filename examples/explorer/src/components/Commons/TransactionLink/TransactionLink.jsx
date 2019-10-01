import React from 'react';
import { Link } from '@reach/router';

import '../../generalStyling.scss';

const TransactionLink = ({ id }) => {
  return (
    <Link className="basicLink" to={`/tx/${id}`}>
      {id}
    </Link>
  );
};

export default TransactionLink;
