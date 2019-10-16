import React from 'react';

import { Amount, AddressLink } from '../../Commons';

import './transactionItem.scss';

const TransactionItem = ({ txItem }) => (
  <div className="transactionItem">
    <div>
      <h5>Address </h5>
      <div>
        <AddressLink id={txItem.address.id} />
      </div>
    </div>
    <div>
      <h5>Amount </h5>
      <Amount decimalAmount={txItem.amount} />
    </div>
  </div>
);

export default TransactionItem;
