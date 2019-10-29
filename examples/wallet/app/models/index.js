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
