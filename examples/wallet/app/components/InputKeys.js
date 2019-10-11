// @flow
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import routes from '../constants/routes.json';

type Props = {
  setAddress: (address: string) => void,
  address: string
};

export default ({ setAddress, address }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    setAddress(newAddress);
  };
  const [newAddress, setNewAddress] = useState(address);
  if (address) {
    return <Redirect push to={routes.HOME} />;
  }
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
    </div>
  );
};
