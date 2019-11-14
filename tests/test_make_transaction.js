import { expect } from 'chai';

const rust = import('../pkg/js_chain_libs');

const genesisHash =
  '6a702a181151b772ca0acbdc4d2870ed80c09b626b29fffc2e47abf2330ad0cd';
const inputAccount = {
  address: 'ca1qh9u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pj2xk344',
  value: '1000',
  privateKey:
    'ed25519e_sk1gz0ff4w444nwejap5shxrllypz5euswq6wn04fffzes02atw99xkd4jn838v3vrfg9eqt7f4sxjlsy0tdcmj0d2dqvwc8ztwgyfnwyszvjg32'
};
const outputAccount = {
  address: 'ca1q5nr5pvt9e5p009strshxndrsx5etcentslp2rwj6csm8sfk24a2w3swacn',
  value: '500'
};
const delegation = {
  stakeKey:
    'ed25519_pk1e0rueku628h2fex8pzp48sdpjqku76zlwwgefhyl4lexkl6zugvs0uuy0w',
  privateKey:
    'ed25519e_sk1gz0ff4w444nwejap5shxrllypz5euswq6wn04fffzes02atw99xkd4jn838v3vrfg9eqt7f4sxjlsy0tdcmj0d2dqvwc8ztwgyfnwyszvjg32',
  poolId: '541db50349e2bc1a5b1a73939b9d86fc45067117cc930c36afbb6fb0a9329d41'
};

it('create transaction', async () => {
  const {
    PoolId,
    OutputPolicy,
    TransactionBuilder,
    Address,
    Input,
    Value,
    Fee,
    PublicKey,
    Certificate,
    Fragment,
    PrivateKey,
    Witness,
    SpendingCounter,
    Hash,
    Account,
    StakeDelegation,
    DelegationType,
    InputOutputBuilder,
    PayloadAuthData,
    StakeDelegationAuthData,
    AccountBindingSignature,
    Payload,
    Witnesses,
    // eslint-disable-next-line camelcase
    uint8array_to_hex
  } = await rust;

  const singlePoolDelegation = DelegationType.full(
    PoolId.from_hex(delegation.poolId)
  );

  const certificate = Certificate.stake_delegation(
    StakeDelegation.new(
      singlePoolDelegation,
      PublicKey.from_bech32(delegation.stakeKey)
    )
  );

  const iobuilder = InputOutputBuilder.empty();

  const accountAddress = Address.from_string(inputAccount.address);
  const account = Account.from_address(accountAddress);

  const input = Input.from_account(account, Value.from_str(inputAccount.value));
  iobuilder.add_input(input);

  iobuilder.add_output(
    Address.from_string(outputAccount.address),
    Value.from_str(outputAccount.value)
  );

  const feeAlgorithm = Fee.linear_fee(
    Value.from_str('20'),
    Value.from_str('5'),
    Value.from_str('10')
  );

  const IOs = iobuilder.seal_with_output_policy(
    Payload.certificate(certificate),
    feeAlgorithm,
    OutputPolicy.one(accountAddress)
  );

  const builderSetWitness = new TransactionBuilder()
    .payload(certificate)
    .set_ios(IOs.inputs(), IOs.outputs());

  const txid = builderSetWitness.get_auth_data_for_witness();

  const witness = Witness.for_account(
    Hash.from_hex(genesisHash),
    txid,
    PrivateKey.from_bech32(inputAccount.privateKey),
    SpendingCounter.zero()
  );

  const witnesses = Witnesses.new();
  witnesses.add(witness);

  const builderSignCertificate = builderSetWitness.set_witnesses(witnesses);

  const signature = PayloadAuthData.for_stake_delegation(
    StakeDelegationAuthData.new(
      AccountBindingSignature.new_single(
        PrivateKey.from_bech32(delegation.privateKey),
        builderSignCertificate.get_auth_data()
      )
    )
  );

  const signedTx = builderSignCertificate.set_payload_auth(signature);

  const message = Fragment.from_transaction(signedTx);

  expect(uint8array_to_hex(message.as_bytes())).to.eql(
    '01410400cbc7ccdb9a51eea4e4c7088353c1a1902dcf685f739194dc9faff26b7f42e21901541db50349e2bc1a5b1a73939b9d86fc45067117cc930c36afbb6fb0a9329d410102ff00000000000003e8cbc7ccdb9a51eea4e4c7088353c1a1902dcf685f739194dc9faff26b7f42e21905263a058b2e6817bcb058e1734da381a995e3335c3e150dd2d621b3c136557aa700000000000001f405cbc7ccdb9a51eea4e4c7088353c1a1902dcf685f739194dc9faff26b7f42e21900000000000001c702ab84ad4220573f1d5037af717d0999aa3726d6f549cd1a9d12feefb20ba0e7211546fb38015196e0061fe2f87d241a54529f93a5c6d4c53be27b43057883e40ee3d1cbb9679be5d0604fac4db2d6768bb332fa053f9db9aee69f8356926e82b31cf20aaec905d3988e2e5b29bc39f25e45583c4a5d765db5f952dc0b38effa0c'
  );
});
