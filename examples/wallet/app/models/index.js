// @flow
// FIXME: use types from the js bindings that represent real addresses
export type Address = string;
export type Balance = number;
export type Amount = number;
export type Counter = number;
export type PublicKey = string;
export type PrivateKey = string;
export type Identifier = string;
export type Delegation = Array<{ poolId: string, amount: number }>;
export type PoolId = string;
export type TransactionHash = string;
export type CertificateType =
  | 'STAKE_DELEGATION'
  | 'POOL_REGISTRATION'
  | 'OWNER_STAKE_DELEGATION';
export type Certificate = {
  type: CertificateType,
  pool: PoolId
};

export type Transaction = {
  id: TransactionHash,
  certificate?: Certificate,
  blockHeight?: number, // it will not be present until the transaction is included in a block
  inputs: Array<TransactionInput>,
  outputs: Array<TransactionOutput>
};
export type TransactionInput = { address: Address, amount: Amount };
export type TransactionOutput = { address: Address, amount: Amount };
