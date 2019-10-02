import React from 'react';
import Big from 'big.js';

import { currency } from '../../../config.json';

import './amount.scss';

const decimalToAmount = decimalAmount => {
  return Big(decimalAmount)
    .div(10 ** currency.decimals)
    .toFixed(currency.decimals);
};

const Amount = ({ decimalAmount }) => (
  <div className="amount">
    <div>{decimalToAmount(decimalAmount)} </div>
    <div> {' ' + currency.symbol}</div>
  </div>
);

export default Amount;
