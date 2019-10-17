// @flow
import { AccountKeys, NodeSettings } from '../reducers/types';
import {} from '../models';

const wasmBindings = import('js-chain-libs/js_chain_libs');
export async function getAccountFromPrivateKey(secret: string): AccountKeys {
  const {
    PrivateKey,
    PublicKey,
    Account,
    AccountIdentifier,
    AddressDiscrimination
  } = await wasmBindings;
  const privateKey: PrivateKey = PrivateKey.from_bech32(secret);
  const publicKey: PublicKey = privateKey.to_public();
  const account: Account = Account.from_public_key(publicKey);
  const identifier: AccountIdentifier = account.to_identifier();
  // FIXME: make the discrimination configurable
  // FIXME somebody please tell me how do we determine the prefix
  // and if it needs to be configurable
  const address: string = account
    .to_address(AddressDiscrimination.Test)
    .to_string('ca');
  return {
    address,
    privateKey: secret,
    identifier: identifier.to_hex()
  };
}

export async function buildTransaction(
  destination: string,
  amount: number,
  secret: string,
  nodeSettings: NodeSettings
): Promise<Uint8Array> {
  const {
    OutputPolicy,
    TransactionBuilder,
    Address,
    Input,
    Value,
    Fee,
    TransactionFinalizer,
    Fragment,
    PrivateKey,
    Witness,
    SpendingCounter,
    Hash,
    Account
  } = await wasmBindings;
  const privateKey: PrivateKey = PrivateKey.from_bech32(secret);
  const sourcePublicKey: PublicKey = privateKey.to_public();
  const sourceAccount: Account = Account.from_public_key(sourcePublicKey);
  // FIXME: make the discrimination configurable
  // FIXME somebody please tell me how do we determine the prefix
  // and if it needs to be configurable
  const address: string = account
    .to_address(AddressDiscrimination.Test)
    .to_string('ca');
  const txbuilder: TransactionBuilder = TransactionBuilder.new_no_payload();
  return {
    address,
    privateKey: secret,
    identifier: identifier.to_hex()
  };
}
