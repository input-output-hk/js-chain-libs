// @flow
import { AccountState } from '../reducers/types';

const wasmBindings = import('js-chain-libs/js_chain_libs');

export default async function getAccountFromPrivateKey(
  secret: string
): AccountState {
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
