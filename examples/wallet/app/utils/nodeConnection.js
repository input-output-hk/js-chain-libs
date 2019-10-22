// @flow
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import config from 'config';
import type { Identifier } from '../models';
import type { AccountState, NodeSettings } from '../reducers/types';

axios.defaults.adapter = httpAdapter;
const BASE_URL = config.get('nodeUrl') + config.get('APIBase');

export function getAccountState(identifier: Identifier): Promise<AccountState> {
  return axios
    .get(`${BASE_URL}/account/${identifier}`)
    .then(({ data: { value, counter, delegation } }) => ({
      balance: value,
      counter,
      delegation: delegation.pools.map(([poolId, amount]) => ({
        poolId,
        amount
      }))
    }));
}

export function getNodeSettings(): Promise<NodeSettings> {
  return axios
    .get(`${BASE_URL}/settings`)
    .then(({ data: { block0Hash, fees } }) => ({ block0Hash, fees }));
}

export function broadcastTransaction(tx: Uint8Array): Promise<void> {
  return axios.post(`${BASE_URL}/message`, tx, {
    headers: {
      'content-type': 'application/octet-stream'
    }
  });
}
