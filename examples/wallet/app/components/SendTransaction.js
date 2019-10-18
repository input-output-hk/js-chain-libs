// @flow
import React, { useState } from 'react';
import typeof { sendTransaction as SendTransaction } from '../actions/account';

type Props = {
  sendTransaction: SendTransaction
};

export default ({ sendTransaction }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    sendTransaction(destinationAddress, Number(amount));
  };
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [amount, setAmount] = useState<?number>();

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
