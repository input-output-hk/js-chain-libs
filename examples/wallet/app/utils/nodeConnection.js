// @flow
import { Address } from '../models';

const BASE_URL = 'http://localhost:8443/api/v0';

export function getBalance(address: Address) {
  return fetch(`${BASE_URL}/account/${address}`)
    .then(response => response.json())
    .then(json => json.value);
}

export function getNodeStats() {}
