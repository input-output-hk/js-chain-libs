import React from 'react';

//TODO: Fix this, create a real component
const Amount = ({ decimalAmount }) => <div className="amount">{decimalAmount / 10 ** 18} ADA</div>;

export default Amount;
