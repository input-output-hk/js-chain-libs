import React from 'react';
import Badge from 'react-bootstrap/Badge';

import { getConfirmations } from '../../../helpers/transactionHelper';

import './assuranceLevel.scss';

const assuranceVariant = {
  unconfirmed: 'warning',
  low: 'light',
  medium: 'primary',
  high: 'success'
};

const AssuranceLevel = ({ transaction, status }) => {
  const { assuranceLevel, confirmations } = getConfirmations(transaction, status);

  return (
    <div className="assuranceLevel">
      <Badge variant={assuranceVariant[assuranceLevel]}>{assuranceLevel.toUpperCase()}</Badge>
      <div> {`${confirmations} confirmations`}</div>
    </div>
  );
};

export default AssuranceLevel;
