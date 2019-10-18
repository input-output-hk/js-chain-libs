import React from 'react';
import { Link } from '@reach/router';

const StakePoolLink = ({ id }) => (
  <Link className="basicLink" to={`/pool/${id}`}>
    {id}
  </Link>
);

export default StakePoolLink;
