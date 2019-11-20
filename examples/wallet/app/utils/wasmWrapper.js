// @flow
import config from 'config';
import type { AccountKeys, NodeSettings } from '../reducers/types';
import type {
  PrivateKey as InternalPrivateKey,
  Counter,
  Delegation,
  TransactionOutput
} from '../models';
import feeCalculator from './feeCalculator';
import { totalParts } from './proportionsHelper';

const wasmBindings = import('js-chain-libs/js_chain_libs');
export async function getAccountFromPrivateKey(
  secret: InternalPrivateKey
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
  newDelegation: Delegation,
  secret: InternalPrivateKey,
  accountCounter: Counter,
  nodeSettings: NodeSettings
): Promise<{ id: string, transaction: Uint8Array, fee: number }> {
  const {
    PoolId,
    Certificate,
    StakeDelegation,
    DelegationType,
    DelegationRatio,
    PoolDelegationRatios,
    PoolDelegationRatio,
    PrivateKey,
    PublicKey
  } = await wasmBindings;
  const privateKey: PrivateKey = PrivateKey.from_bech32(secret);
  const sourcePublicKey: PublicKey = privateKey.to_public();
  let delegationType: DelegationType;
  const pools: Array<PoolId> = Object.keys(newDelegation);
  if (pools.length === 0) {
    delegationType = DelegationType.non_delegated();
  } else if (pools.length === 1) {
    delegationType = DelegationType.full(PoolId.from_hex(pools[0]));
  } else {
    const poolDelegationRatios = PoolDelegationRatios.new();
    pools.forEach(poolId =>
      poolDelegationRatios.add(
        PoolDelegationRatio.new(
          PoolId.from_hex(poolId),
          newDelegation[poolId].parts
        )
      )
    );
    delegationType = DelegationType.ratio(
      DelegationRatio.new(totalParts(newDelegation), poolDelegationRatios)
    );
  }
  // Create certificate
  const certificate: Certificate = Certificate.stake_delegation(
    StakeDelegation.new(delegationType, sourcePublicKey)
  );
  return buildTransaction(secret, nodeSettings, accountCounter, certificate);
}

export async function buildSendFundsTransaction(
  destination: string,
  amount: number,
  secret: InternalPrivateKey,
  accountCounter: number,
  nodeSettings: NodeSettings
): Promise<{ id: string, transaction: Uint8Array, fee: number }> {
  return buildTransaction(secret, nodeSettings, accountCounter, undefined, {
    amount,
    address: destination
  });
}

async function buildTransaction(
  secret: string,
  nodeSettings: NodeSettings,
  accountCounter: number,
  certificate?: any,
  output?: TransactionOutput
) {
  if (!certificate && !output) {
    console.error(
      'it doesnt make sense to send a transaction with only an input'
    );
  } else if (certificate && output) {
    console.error(
      'in the wallet theres no way of sending a trasaction with both an output and a certificate, this is an error'
    );
  }
  const {
    OutputPolicy,
    Address,
    TransactionBuilder,
    InputOutput,
    InputOutputBuilder,
    Payload,
    Witnesses,
    PayloadAuthData,
    Transaction,
    TransactionBuilderSetWitness,
    TransactionBuilderSetAuthData,
    TransactionBuilderSetIOs,
    StakeDelegationAuthData,
    AccountBindingSignature,
    Input,
    Value,
    Fee,
    Fragment,
    PrivateKey,
    Witness,
    SpendingCounter,
    Hash,
    Account,
    // eslint-disable-next-line camelcase
    uint8array_to_hex
  } = await wasmBindings;
  const { calculateFee } = feeCalculator(nodeSettings);
  const privateKey: PrivateKey = PrivateKey.from_bech32(secret);
  const sourceAccount: Account = Account.from_public_key(
    privateKey.to_public()
  );

  const computedFee: number = calculateFee(
    1,
    output ? 1 : 0,
    certificate ? 1 : 0
  );
  const iobuilder: InputOutputBuilder = InputOutputBuilder.empty();
  let inputAmount;
  if (output) {
    inputAmount = output.amount + computedFee;
    iobuilder.add_output(
      Address.from_string(output.address),
      Value.from_str(output.amount.toString())
    );
  } else {
    inputAmount = computedFee;
  }
  const input: Input = Input.from_account(
    sourceAccount,
    Value.from_str(inputAmount.toString())
  );

  iobuilder.add_input(input);

  const feeAlgorithm: Fee = Fee.linear_fee(
    Value.from_str(nodeSettings.fees.constant.toString()),
    Value.from_str(nodeSettings.fees.coefficient.toString()),
    Value.from_str(nodeSettings.fees.certificate.toString())
  );

  // The amount is exact, that's why we use `forget()`
  const IOs: InputOutput = iobuilder.seal_with_output_policy(
    certificate ? Payload.certificate(certificate) : Payload.no_payload(),
    feeAlgorithm,
    OutputPolicy.forget()
  );

  const txbuilder: TransactionBuilder = new TransactionBuilder();

  const builderSetIOs: TransactionBuilderSetIOs = certificate
    ? txbuilder.payload(certificate)
    : txbuilder.no_payload();

  const builderSetWitness: TransactionBuilderSetWitness = builderSetIOs.set_ios(
    IOs.inputs(),
    IOs.outputs()
  );

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

  const signature: PayloadAuthData = certificate
    ? PayloadAuthData.for_stake_delegation(
        StakeDelegationAuthData.new(
          AccountBindingSignature.new(
            PrivateKey.from_bech32(secret),
            builderSignCertificate.get_auth_data()
          )
        )
      )
    : PayloadAuthData.for_no_payload();

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
