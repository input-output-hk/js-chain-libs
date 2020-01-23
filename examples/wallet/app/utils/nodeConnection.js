// @flow
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import config from 'config';
import { NodePromiseClient } from '../generated/node_grpc_web_pb';
import { uint8ArrayToHexString } from './lowLevelHelper';
import { HandshakeRequest, HandshakeResponse } from '../generated/node_pb';
import type {
  Address,
  Identifier,
  Pool,
  Transaction,
  Balance,
  Delegation,
  Counter
} from '../models';
import type { AccountState, NodeSettings } from '../reducers/types';

axios.defaults.adapter = httpAdapter;
const NODE_URL = config.get('nodeUrl');
const REST_PORT = config.get('nodeRESTPort');
const GRPC_PORT = config.get('nodeGRPCPort');
const BASE_REST_URL = `${NODE_URL}:${REST_PORT}${config.get('APIBase')}`;
const GRPC_URL = `${NODE_URL}:${GRPC_PORT}`;

const grpcClient: NodePromiseClient = new NodePromiseClient(GRPC_URL);

export type BroadcastTransaction = $PropertyType<
  $Call<typeof nodeConnectionBuilder>,
  'broadcastTransaction'
>;

export default function nodeConnectionBuilder({
  injectedAxios,
  injectedGrpcClient
}: {
  injectedAxios?: any,
  injectedGrpcClient?: any
} = {}) {
  const axiosInstance = ((injectedAxios: any): typeof axios) || axios;
  const grpcClientInstance =
    (injectedGrpcClient: typeof grpcClient) || grpcClient;
  const getAccountState = function getAccountState(
    identifier: Identifier
  ): Promise<AccountState> {
    return axiosInstance
      .get(`${BASE_REST_URL}/account/${identifier}`)
      .then(({ data: { value, counter, delegation } }) => ({
        balance: value,
        counter,
        delegation: delegation.pools.reduce(
          (acc, [poolId, amount]) =>
            Object.assign(acc, { [poolId]: { parts: amount } }),
          {}
        )
      }))
      .catch(error => {
        // When an account is imported with BIP39, the account may not
        // exist in the blockchain. For this DEMO we hardcode the account
        // information when an HTTP 404 occurs because we interpret that
        // the account exists. If any type of error occurs, an exception
        // is thrown to be handled in the upper layers.
        if (error && error.response && error.response.status === 404) {
          const balance: Balance = 0;
          const counter: Counter = 0;
          const delegation: Delegation = { '00000x': { parts: 1 } };
          return {
            balance,
            counter,
            delegation
          };
        }
        throw error;
      });
  };

  const getTransactions = function getTransactions(
    address: Address
  ): Promise<{ transactions: Array<Transaction> }> {
    return axiosInstance
      .post(`${NODE_URL}:${REST_PORT}/explorer/graphql`, {
        operationName: 'getTransactions',
        variables: { address },
        query: graphQlGetTransactionsQuery
      })
      .then(({ data: { data: { address: { transactions: { edges } } } } }) => ({
        transactions: edges.map(({ node }) => ({
          id: node.id,
          outputs: flattenInputOrOutput(node.outputs),
          inputs: flattenInputOrOutput(node.inputs),
          blockHeight: Number(node.block.chainLength),
          certificate: getCertificate(node.certificate)
        }))
      }))
      .catch(error => {
        // When an account is imported with BIP39, the account may not
        // exist in the blockchain. For this DEMO we hardcode the account
        // information when an HTTP 404 occurs because we interpret that
        // the account exists. If any type of error occurs, an exception
        // is thrown to be handled in the upper layers.
        if (error && error.response && error.response.status === 404) {
          const transactions = { data: { address: { transactions: [] } } };
          return transactions;
        }
        throw error;
      });
  };

  const getNodeSettings = function getNodeSettings(): Promise<NodeSettings> {
    return grpcClientInstance
      .handshake(new HandshakeRequest())
      .then((response: HandshakeResponse) => ({
        block0Hash: uint8ArrayToHexString(response.getBlock0_asU8()),
        fees: config.get('fees')
      }));
  };

  const getStakePools = function getStakePools(): Promise<Array<Pool>> {
    return axiosInstance
      .post(`${NODE_URL}:${REST_PORT}/explorer/graphql`, {
        operationName: 'getStakepoolDetails',
        query: graphQlGetStakepoolDetails
      })
      .then(({ data: { data: { allStakePools: { edges } } } }) =>
        edges.map(({ node: { id, registration: { owners, operators } } }) => ({
          id,
          owners,
          operators
        }))
      );
  };

  const broadcastTransaction = function broadcastTransaction(
    tx: Uint8Array
  ): Promise<mixed> {
    return axiosInstance.post(`${BASE_REST_URL}/message`, tx, {
      headers: {
        'content-type': 'application/octet-stream'
      }
    });
  };
  return {
    getStakePools,
    getAccountState,
    getTransactions,
    getNodeSettings,
    broadcastTransaction
  };
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
    // FIXME: handle multiple pool delegation
    pool: it.pool ? it.pool.id : it.pools[0].id
  };
};

const flattenInputOrOutput = (
  arr: Array<{ amount: number, address: { id: Address } }>
) =>
  arr.map(({ address, amount }) => ({
    amount: Number(amount),
    address: address.id
  }));

const graphQlGetTransactionsQuery =
  'query getTransactions($address: String!)\
{\
  address(bech32: $address){\
    id,\
    transactions {\
      edges{\
        node{\
          id,\
          certificate{\
            __typename,\
            ... on StakeDelegation {\
              pools{\
                id\
              }\
            }\
            ... on PoolRegistration {\
              pool{\
                id\
              }\
            }\
            ... on OwnerStakeDelegation {\
              pools{\
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
    }\
  }\
}';

const graphQlGetStakepoolDetails =
  'query getStakepoolDetails {\
  allStakePools{\
    edges{\
      node{\
        id\
        registration{\
          operators\
          owners\
        }\
      }\
    }\
  }\
}';
