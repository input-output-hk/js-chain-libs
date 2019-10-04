import React from 'react';
import { Link } from '@reach/router';

import '../../../generalStyling.scss';

const TransactionLink = ({ id }) => (
  <Link className="basicLink" to={`/tx/${id}`}>
    {id}
  </Link>
);

export default TransactionLink;
