// @flow
// FIXME: use types from the js bindings that represent real addresses
export type Address = string;
export type Balance = number;
export type Amount = number;
export type Counter = number;
export type PublicKey = string;
export type PrivateKey = string;
export type DelegationEntry = { parts: number };
export type NewDelegationEntry = DelegationEntry & { color: Color };
export type Delegation = { [PoolId]: DelegationEntry };
export type NewDelegation = { [PoolId]: NewDelegationEntry };
export type Identifier = string;
export type PoolId = string;
export type TransactionHash = string;
export type CertificateType =
  | 'STAKE_DELEGATION'
  | 'POOL_REGISTRATION'
  | 'OWNER_STAKE_DELEGATION';
export type Certificate = {
  type: CertificateType,
  pools: Array<PoolId>
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

// there must be a better way to do this 😢
export type Color =
  | '#f2777a'
  | '#99cc99'
  | '#ffcc66'
  | '#6699cc'
  | '#cc99cc'
  | '#66cccc'
  | '#d3d0c8'
  | '#747369';
