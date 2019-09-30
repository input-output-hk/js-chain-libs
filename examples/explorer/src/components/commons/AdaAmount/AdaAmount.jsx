import React from 'react';

//TODO: Fix this, create a real component
const AdaAmount = ({ lovelaceAmount }) => (
  <div className="adaAmount">
    <h5>{lovelaceAmount / 10 ** 18} ADA</h5>
  </div>
);

export default AdaAmount;
