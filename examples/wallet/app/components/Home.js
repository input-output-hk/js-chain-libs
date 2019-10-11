// @flow
import React, { useState } from 'react';

type Props = {
  setAddress: (address: string) => void,
  balance: number,
  address: string
};

export default ({ setAddress, balance, address }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    setAddress(newAddress);
  };
  const [newAddress, setNewAddress] = useState(address);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="address">
          Address:
          <input
            type="text"
            name="address"
            value={newAddress}
            onChange={event => setNewAddress(event.target.value)}
          />
        </label>
        <input type="submit" value="Get balance!" />
      </form>
      <p>Current Address: {address}</p>
      <p>Balance: {balance}</p>
    </div>
  );
};
