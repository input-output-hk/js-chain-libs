// @flow
import { Address } from '../models';
import { NodeSettings } from '../reducers/types';

const BASE_URL = 'http://localhost:8443/api/v0';

export function getBalance(address: Address): Promise<number> {
  return fetch(`${BASE_URL}/account/${address}`)
    .then(response => response.json())
    .then(json => json.value);
}

export function getNodeSettings(): Promise<NodeSettings> {
  return fetch(`${BASE_URL}/settings`)
    .then(response => response.json())
    .then(({ block0Hash, fees }) => ({ block0Hash, fees }));
}
