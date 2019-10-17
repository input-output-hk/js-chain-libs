import { Address, Balance, PrivateKey, Identifier } from '../models';

export type AppState = {
  account: AccountState,
  balance: Balance,
  nodeSettings: NodeSettings
};

export type AccountState = {
  address: Address,
  privateKey: PrivateKey,
  identifier: Identifier
};

export type Action = {
  +type: string
};

export type NodeSettings = {
  block0Hash: string,
  fees: {
    certificate: number,
    coefficient: number,
    constant: number
  }
};
