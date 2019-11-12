// @flow
import config from 'config';
import type { AccountKeys, NodeSettings } from '../reducers/types';
import type {
  PoolId as InternalPoolId,
  PrivateKey as InternalPrivateKey,
  Counter
} from '../models';
import feeCalculator from './feeCalculator';

const wasmBindings = import('js-chain-libs/js_chain_libs');
export async function getAccountFromPrivateKey(
  secret: string
): Promise<AccountKeys> {
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
  const networkDiscrimination: AddressDiscrimination =
    config.get('networkDiscrimination') === 'testnet'
      ? AddressDiscrimination.Test
      : AddressDiscrimination.Production;
  const address: string = account
    .to_address(networkDiscrimination)
    .to_string(config.get('addressPrefix'));
  return {
    address,
    privateKey: secret,
    identifier: identifier.to_hex()
  };
}

export async function buildDelegateTransaction(
  poolId: InternalPoolId,
  secret: InternalPrivateKey,
  accountCounter: Counter,
  nodeSettings: NodeSettings
): Promise<{ id: string, transaction: Uint8Array, fee: number }> {
  const {
    OutputPolicy,
    PoolId,
    TransactionBuilder,
    InputOutput,
    InputOutputBuilder,
    Payload,
    Witnesses,
    PayloadAuthData,
    DelegationType,
    StakeDelegationAuthData,
    AccountBindingSignature,
    Transaction,
    TransactionBuilderSetWitness,
    TransactionBuilderSetAuthData,
    Certificate,
    StakeDelegation,
    Input,
    Value,
    Fee,
    Fragment,
    PrivateKey,
    PublicKey,
    Witness,
    SpendingCounter,
    Hash,
    Account,
    // eslint-disable-next-line camelcase
    uint8array_to_hex
  } = await wasmBindings;
  const { calculateFee } = feeCalculator(nodeSettings);
  const privateKey: PrivateKey = PrivateKey.from_bech32(secret);
  const sourcePublicKey: PublicKey = privateKey.to_public();
  const sourceAccount: Account = Account.from_public_key(
    privateKey.to_public()
  );

  // 1 input + 1 certificate
  const computedFee: number = calculateFee(1, 0, 1);
  const input: Input = Input.from_account(
    sourceAccount,
    Value.from_str(computedFee.toString())
  );
  // Create certificate
  const singlePoolDelegation: DelegationType = DelegationType.full(
    PoolId.from_hex(poolId)
  );
  const certificate: Certificate = Certificate.stake_delegation(
    StakeDelegation.new(singlePoolDelegation, sourcePublicKey)
  );

  const iobuilder: InputOutputBuilder = InputOutputBuilder.empty();

  iobuilder.add_input(input);

  const feeAlgorithm: Fee = Fee.linear_fee(
    Value.from_str(nodeSettings.fees.constant.toString()),
    Value.from_str(nodeSettings.fees.coefficient.toString()),
    Value.from_str(nodeSettings.fees.certificate.toString())
  );

  // The amount is exact, that's why we use `forget()`
  const IOs: InputOutput = iobuilder.seal_with_output_policy(
    Payload.certificate(certificate),
    feeAlgorithm,
    OutputPolicy.forget()
  );

  const builderSetWitness: TransactionBuilderSetWitness = new TransactionBuilder()
    .payload(certificate)
    .set_ios(IOs.inputs(), IOs.outputs());

  const witness: Witness = Witness.for_account(
    Hash.from_hex(nodeSettings.block0Hash),
    builderSetWitness.get_auth_data_for_witness(),
    privateKey,
    SpendingCounter.from_u32(accountCounter)
  );
  const witnesses: Witness = Witnesses.new();
  witnesses.add(witness);

  const builderSignCertificate: TransactionBuilderSetAuthData = builderSetWitness.set_witnesses(
    witnesses
  );

  const signature: PayloadAuthData = PayloadAuthData.for_stake_delegation(
    StakeDelegationAuthData.new(
      AccountBindingSignature.new(
        PrivateKey.from_bech32(secret),
        builderSignCertificate.get_auth_data()
      )
    )
  );

  const signedTx: Transaction = builderSignCertificate.set_payload_auth(
    signature
  );

  const message: Fragment = Fragment.from_transaction(signedTx);

  return {
    transaction: message.as_bytes(),
    id: uint8array_to_hex(message.id().as_bytes()),
    fee: computedFee
  };
}

export async function buildTransaction(
  destination: string,
  amount: number,
  secret: string,
  accountCounter: number,
  nodeSettings: NodeSettings
): Promise<{ id: string, transaction: Uint8Array, fee: number }> {
  const {
    OutputPolicy,
    TransactionBuilder,
    Address,
    Input,
    Value,
    Fee,
    TransactionFinalizer,
    Transaction,
    Fragment,
    PrivateKey,
    PublicKey,
    Witness,
    SpendingCounter,
    Hash,
    Account,
    // eslint-disable-next-line camelcase
    uint8array_to_hex
  } = await wasmBindings;
  const { calculateFee } = feeCalculator(nodeSettings);
  const privateKey: PrivateKey = PrivateKey.from_bech32(secret);
  const sourcePublicKey: PublicKey = privateKey.to_public();
  const sourceAccount: Account = Account.from_public_key(sourcePublicKey);

  // 1 input + 1 output
  const computedFee = calculateFee(1, 1, 0);
  const inputAmount = computedFee + amount;
  const input: Input = Input.from_account(
    sourceAccount,
    Value.from_str(inputAmount.toString())
  );
  const txbuilder: TransactionBuilder = TransactionBuilder.new_no_payload();
  txbuilder.add_input(input);

  txbuilder.add_output(
    Address.from_string(destination),
    Value.from_str(amount.toString())
  );

  const feeAlgorithm = Fee.linear_fee(
    Value.from_str(nodeSettings.fees.constant.toString()),
    Value.from_str(nodeSettings.fees.coefficient.toString()),
    Value.from_str(nodeSettings.fees.certificate.toString())
  );
  // The amount is exact, that's why we use `forget()`
  const finalizedTx: Transaction = txbuilder.seal_with_output_policy(
    feeAlgorithm,
    OutputPolicy.forget()
  );
  const finalizer: TransactionFinalizer = new TransactionFinalizer(finalizedTx);

  const witness = Witness.for_account(
    Hash.from_hex(nodeSettings.block0Hash),
    finalizer.get_tx_sign_data_hash(),
    privateKey,
    SpendingCounter.from_u32(accountCounter)
  );
  finalizer.set_witness(0, witness);
  const signedTx = finalizer.finalize();
  const message: Fragment = Fragment.from_authenticated_transaction(signedTx);
  return {
    transaction: message.as_bytes(),
    id: uint8array_to_hex(message.id().as_bytes()),
    fee: computedFee
  };
}
