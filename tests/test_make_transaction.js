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
    TransactionFinalizer,
    Fragment,
    PrivateKey,
    Witness,
    SpendingCounter,
    Hash,
    Account,
    StakeDelegation,
    // eslint-disable-next-line camelcase
    uint8array_to_hex
  } = await rust;

  const certificate = Certificate.stake_delegation(
    StakeDelegation.new(
      PoolId.from_hex(delegation.poolId),
      PublicKey.from_bech32(delegation.stakeKey)
    )
  );

  certificate.sign(PrivateKey.from_bech32(delegation.privateKey));

  const txbuilder = TransactionBuilder.new_payload(certificate);

  const accountAddress = Address.from_string(inputAccount.address);
  const account = Account.from_address(accountAddress);

  const input = Input.from_account(account, Value.from_str(inputAccount.value));

  txbuilder.add_input(input);

  txbuilder.add_output(
    Address.from_string(outputAccount.address),
    Value.from_str(outputAccount.value)
  );

  const feeAlgorithm = Fee.linear_fee(
    Value.from_str('20'),
    Value.from_str('5'),
    Value.from_str('10')
  );

  const finalizedTx = txbuilder.finalize(
    feeAlgorithm,
    OutputPolicy.one(accountAddress)
  );

  const finalizer = new TransactionFinalizer(finalizedTx);

  const witness = Witness.for_account(
    Hash.from_hex(genesisHash),
    finalizer.get_txid(),
    PrivateKey.from_bech32(inputAccount.privateKey),
    SpendingCounter.zero()
  );

  finalizer.set_witness(0, witness);

  const signedTx = finalizer.build();

  const message = Fragment.from_authenticated_transaction(signedTx);

  expect(uint8array_to_hex(message.as_bytes())).to.eql(
    '00ff04cbc7ccdb9a51eea4e4c7088353c1a1902dcf685f739194dc9faff26b7f42e219541db50349e2bc1a5b1a73939b9d86fc45067117cc930c36afbb6fb0a9329d410102ff00000000000003e8cbc7ccdb9a51eea4e4c7088353c1a1902dcf685f739194dc9faff26b7f42e21905263a058b2e6817bcb058e1734da381a995e3335c3e150dd2d621b3c136557aa700000000000001f405cbc7ccdb9a51eea4e4c7088353c1a1902dcf685f739194dc9faff26b7f42e21900000000000001c702ad3b6faf39aad65bfd793f25e2ec37fdddf6c4ca36a3c8563b659da30c3e7cfc2f1f276aaaf2a089013f301e04c8aae0fb42a958997c93f0400b0b830d64970a'
  );
});
