// @flow
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import routes from '../constants/routes.json';
import typeof { setAccount as SetAccount } from '../actions/account';
import typeof { updateNodeSettings as UpdateNodeSettings } from '../actions/nodeSettings';

type Props = {
  setAccount: SetAccount,
  updateNodeSettings: UpdateNodeSettings,
  privateKey: string
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({ updateNodeSettings, setAccount, privateKey }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    return Promise.all([setAccount(newPrivateKey), updateNodeSettings()]);
  };

  if (privateKey) {
    return <Redirect push to={routes.HOME} />;
  }

  const [newPrivateKey, setNewPrivateKey] = useState(privateKey);

  return (
    <div>
      <p>
        Please enter you private key. It&apos;s a string like:
        <br />{' '}
        <code>
          ed25519e_sk15psr45hyqnpwcl8xd4lv0m32prenhh8kcltgte2305h5jgynndxect9274j0am0qmmd0snjuadnm6xkgssnkn2njvkg8et8qg0vevsgnwvmpl
        </code>
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="privateKey">
          Private key:
          <input
            type="text"
            name="privateKey"
            value={newPrivateKey}
            onChange={event => setNewPrivateKey(event.target.value)}
          />
        </label>
        <input type="submit" value="Initialize wallet" />
      </form>
    </div>
  );
};
