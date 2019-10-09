import React from 'react';

import Amount from '../../Commons/Amount/Amount';
import Addresslink from '../../Commons/AddressLink/AddressLink';

import './transactionItem.scss';

const TransactionItem = ({ txItem }) => (
  <div className="transactionItem">
    <div>
      <h5>Address </h5>
      <div>
        <Addresslink id={txItem.address.id} />
      </div>
    </div>
    <div>
      <h5>Amount </h5>
      <Amount decimalAmount={txItem.amount} />
    </div>
  </div>
);

export default TransactionItem;
