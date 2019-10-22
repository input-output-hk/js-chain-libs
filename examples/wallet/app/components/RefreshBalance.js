// @flow
import React from 'react';
import typeof { updateBalanceAndCounter as UpdateBalanceAndCounter } from '../actions/account';

type Props = {
  updateBalanceAndCounter: UpdateBalanceAndCounter
};

export default ({ updateBalanceAndCounter }: Props) => {
  return (
    <button type="button" onClick={updateBalanceAndCounter}>
      Refresh balance{' '}
    </button>
  );
};
