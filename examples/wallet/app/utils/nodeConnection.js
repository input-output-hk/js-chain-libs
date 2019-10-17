// @flow
import { Identifier } from '../models';
import { BalanceAndCounter, NodeSettings } from '../reducers/types';

const BASE_URL = 'http://localhost:8443/api/v0';

export function getBalanceAndCounter(
  identifier: Identifier
): Promise<BalanceAndCounter> {
  return fetch(`${BASE_URL}/account/${identifier}`)
    .then(response => response.json())
    .then(({ value, counter }) => ({ balance: value, counter }));
}

export function getNodeSettings(): Promise<NodeSettings> {
  return fetch(`${BASE_URL}/settings`)
    .then(response => response.json())
    .then(({ block0Hash, fees }) => ({ block0Hash, fees }));
}
