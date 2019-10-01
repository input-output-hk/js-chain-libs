import React from 'react';

//TODO: Fix this, create a real component
const AdaAmount = ({ lovelaceAmount }) => (
  <div className="adaAmount">{lovelaceAmount / 10 ** 18} ADA</div>
);

export default AdaAmount;
