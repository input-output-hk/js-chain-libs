import React from 'react';
import { Link } from '@reach/router';

import '../../../generalStyling.scss';

const AddressLink = ({ id }) => (
  <Link className="basicLink" to={`/address/${id}`}>
    {id}
  </Link>
);

export default AddressLink;
