// @flow
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { Identifier } from '../models';
import { BalanceAndCounter, NodeSettings } from '../reducers/types';

axios.defaults.adapter = httpAdapter;
const BASE_URL = 'http://localhost:8443/api/v0';

export function getBalanceAndCounter(
  identifier: Identifier
): Promise<BalanceAndCounter> {
  return axios
    .get(`${BASE_URL}/account/${identifier}`)
    .then(({ data: { value, counter } }) => ({ balance: value, counter }));
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
