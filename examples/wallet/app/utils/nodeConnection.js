// @flow
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import config from 'config';
import type { Address, Identifier, PoolId, Transaction } from '../models';
import type { AccountState, NodeSettings } from '../reducers/types';

axios.defaults.adapter = httpAdapter;
const NODE_URL = config.get('nodeUrl');
const BASE_REST_URL = NODE_URL + config.get('APIBase');

export function getAccountState(identifier: Identifier): Promise<AccountState> {
  return axios
    .get(`${BASE_REST_URL}/account/${identifier}`)
    .then(({ data: { value, counter, delegation } }) => ({
      balance: value,
      counter,
      delegation: delegation.pools.map(([poolId, amount]) => ({
        poolId,
        amount
      }))
    }));
}

const flattenInputOrOutput = (
  arr: Array<{ amount: number, address: { id: Address } }>
) =>
  arr.map(({ address, amount }) => ({
    amount: Number(amount),
    address: address.id
  }));

export function getTransactions(address: Address): Promise<Array<Transaction>> {
  return axios
    .post(`${NODE_URL}/explorer/graphql`, {
      operationName: 'getTransactions',
      variables: { address },
      query: graphQlGetTransactionsQuery
    })
    .then(({ data: { data: { address: { transactions } } } }) => ({
      transactions: transactions.map(it => ({
        id: it.id,
        outputs: flattenInputOrOutput(it.outputs),
        inputs: flattenInputOrOutput(it.inputs),
        blockHeight: Number(it.block.chainLength),
        certificate: getCertificate(it.certificate)
      }))
    }));
}

const getCertificate = it => {
  if (!it) {
    return null;
  }
  return {
    type: {
      StakeDelegation: 'STAKE_DELEGATION',
      OwnerStakeDelegation: 'OWNER_STAKE_DELEGATION',
      PoolRegistration: 'POOL_REGISTRATION'
      // eslint-disable-next-line no-underscore-dangle
    }[it.__typename],
    pool: it.pool.id
  };
};

export function getNodeSettings(): Promise<NodeSettings> {
  return axios
    .get(`${BASE_REST_URL}/settings`)
    .then(({ data: { block0Hash, fees } }) => ({ block0Hash, fees }));
}

export function getStakePools(): Promise<Array<PoolId>> {
  return axios.get(`${BASE_REST_URL}/stake_pools`).then(({ data }) => data);
}

export function broadcastTransaction(tx: Uint8Array): Promise<void> {
  return axios.post(`${BASE_REST_URL}/message`, tx, {
    headers: {
      'content-type': 'application/octet-stream'
    }
  });
}

const graphQlGetTransactionsQuery =
  'query getTransactions($address: String!)\
{\
  address(bech32: $address){\
    id,\
    transactions {\
      id,\
      certificate{\
        __typename,\
        ... on StakeDelegation {\
          pool{\
            id\
          }\
        }\
        ... on PoolRegistration {\
          pool{\
            id\
          }\
        }\
        ... on OwnerStakeDelegation {\
          pool{\
            id\
          }\
        }\
      },\
      block{\
        chainLength\
      }\
      inputs{\
        amount,\
        address {\
          id\
        }\
      }\
      outputs{\
        amount,\
        address{\
          id\
        }\
      }\
    }\
  }\
}';
