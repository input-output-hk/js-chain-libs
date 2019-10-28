// @flow
import React from 'react';
import typeof { updateAccountState as UpdateAccountState } from '../actions/account';

type Props = {
  updateAccountState: UpdateAccountState
};

export default ({ updateAccountState }: Props) => {
  return (
    <button type="button" onClick={updateAccountState}>
      Refresh balance{' '}
    </button>
  );
};
