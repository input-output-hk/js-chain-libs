/* eslint-disable promise/always-return */
/* global BigInt */
const rust = import('../pkg/js_chain_libs');

async function makeTransaction(args) {
  const { genesisHash, inputAccount, outputAccount, delegation } = args;
  const {
    StakePoolId,
    OutputPolicy,
    TransactionBuilder,
    Address,
    Input,
    Value,
    Fee,
    PublicKey,
    Certificate,
    TransactionFinalizer,
    Message,
    PrivateKey,
    Witness,
    SpendingCounter,
    Hash,
    Account,
    uint8array_to_hex
  } = await rust;
  const txbuilder = new TransactionBuilder();

  const accountAddress = Address.from_string(inputAccount.address);
  const account = Account.from_address(accountAddress);

  const input = Input.from_account(
    account,
    Value.from_u64(BigInt(inputAccount.value))
  );

  txbuilder.add_input(input);

  txbuilder.add_output(
    Address.from_string(outputAccount.address),
    Value.from_u64(BigInt(outputAccount.value))
  );

  const certificate = Certificate.stake_delegation(
    StakePoolId.from_hex(delegation.poolId),
    PublicKey.from_bech32(delegation.stakeKey)
  );

  certificate.sign(PrivateKey.from_bech32(delegation.privateKey));

  txbuilder.set_certificate(certificate);

  const feeAlgorithm = Fee.linear_fee(BigInt(20), BigInt(5), BigInt(10));

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

  const message = Message.from_generated_transaction(signedTx);

}

makeTransaction({
  genesisHash:
    '6a702a181151b772ca0acbdc4d2870ed80c09b626b29fffc2e47abf2330ad0cd',
  inputAccount: {
    address: 'ca1qh9u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pj2xk344',
    value: 1000,
    privateKey:
      'ed25519e_sk1gz0ff4w444nwejap5shxrllypz5euswq6wn04fffzes02atw99xkd4jn838v3vrfg9eqt7f4sxjlsy0tdcmj0d2dqvwc8ztwgyfnwyszvjg32'
  },
  outputAccount: {
    address: 'ca1q5nr5pvt9e5p009strshxndrsx5etcentslp2rwj6csm8sfk24a2w3swacn',
    value: 500
  },
  delegation: {
    stakeKey:
      'ed25519_pk1e0rueku628h2fex8pzp48sdpjqku76zlwwgefhyl4lexkl6zugvs0uuy0w',
    privateKey:
      'ed25519e_sk1gz0ff4w444nwejap5shxrllypz5euswq6wn04fffzes02atw99xkd4jn838v3vrfg9eqt7f4sxjlsy0tdcmj0d2dqvwc8ztwgyfnwyszvjg32',
    poolId: '541db50349e2bc1a5b1a73939b9d86fc45067117cc930c36afbb6fb0a9329d41'
  }
});
