import React from 'react';
import { Link } from '@reach/router';

import '../../../generalStyling.scss';

const EpochLink = ({ number }) => (
  <Link className="basicLink" to={`/epoch/${number}`}>
    {number}
  </Link>
);

export default EpochLink;
