// @flow
import React, { useState } from 'react';

type Props = {
  setNewAddress: (address: string) => void,
  balance: number,
  address: string
};

export default ({ setNewAddress, balance, address }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    console.log(event.target.address);
    event.preventDefault();
    setNewAddress(newAddress);
  };
  const [newAddress, setAddress] = useState(address);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label id="address">
          address:
          <input
            type="text"
            name="address"
            value={newAddress}
            onChange={event => setAddress(event.target.value)}
          />
        </label>
        <input type="submit" value="Get balance!" />
      </form>
      <p>Current Address: {address}</p>
      <p>Balance: {newAddress}</p>
    </div>
  );
};
