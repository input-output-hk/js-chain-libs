import React from 'react';
import { Link } from '@reach/router';

import '../../generalStyling.scss';

const AccountLink = ({ id }) => {
  return <div className="basicLink">{id}</div>;
};

export default AccountLink;
