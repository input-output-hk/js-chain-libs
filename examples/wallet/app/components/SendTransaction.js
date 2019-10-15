// @flow
import React, { useState } from 'react';
import typeof { updateBalance as UpdateBalance } from '../actions/balance';

type Props = {
  updateBalance: UpdateBalance
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({ updateBalance }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    return updateBalance();
  };
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState();

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="recipient">
        Recipient:
        <input
          type="text"
          name="recipient"
          value={destinationAddress}
          onChange={event => setDestinationAddress(event.target.value)}
        />
      </label>
      <label htmlFor="amount">
        Amount:
        <input
          type="number"
          name="amount"
          value={amount}
          onChange={event => setAmount(event.target.value)}
        />
      </label>
      <input type="submit" value="Send!" />
    </form>
  );
};
