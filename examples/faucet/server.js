// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const fastifyEnv = require('fastify-env');
const chainLibs = require('./js-chain-libs/js_chain_libs');
const jormungandrApi = require('./jormungandr_api');

// Get config from .env file
const schema = {
  type: 'object',
  required: ['JORMUNGANDR_API', 'SECRET_KEY', 'LOVELACES_TO_GIVE'],
  properties: {
    // The node address
    JORMUNGANDR_API: {
      type: 'string',
      default: 'http://localhost:8443/api'
    },
    // The faucet secret key in bech32 format
    SECRET_KEY: {
      type: 'string'
    },
    // The port to listen to
    PORT: {
      type: 'string',
      default: 3000
    },
    // Fixed amount of lovelaces to give on each request
    LOVELACES_TO_GIVE: {
      type: 'number',
      default: 3000
    }
  }
};

const options = {
  schema,
  dotenv: true
};

fastify.post('/send-money/:destinationAddress', async (request, reply) => {
  try {
    const {
      OutputPolicy,
      TransactionBuilder,
      Address,
      Input,
      Value,
      Fee,
      Fragment,
      PrivateKey,
      Witness,
      SpendingCounter,
      Hash,
      Account,
      InputOutputBuilder,
      PayloadAuthData,
      Payload,
      Witnesses,
      // eslint-disable-next-line camelcase
      uint8array_to_hex
    } = await chainLibs;

    // From the settings we can get:
    // the block0hash used for signing
    // the transaction fees
    const nodeSettings = await jormungandrApi.getNodeSettings(
      fastify.config.JORMUNGANDR_API
    );

    const iobuilder = InputOutputBuilder.empty();

    const secretKey = PrivateKey.from_bech32(fastify.config.SECRET_KEY);
    const faucetAccount = Account.from_public_key(secretKey.to_public());

    // Fee (#inputs + #outputs) * coefficient + constant + #certificates*certificate
    // #inputs = 1; #outputs = 2; #certificates = 0
    const computedFee =
      (1 + 1) * nodeSettings.fees.coefficient + nodeSettings.fees.constant;

    const inputAmount = fastify.config.LOVELACES_TO_GIVE + computedFee;

    // To get the account spending counter used for signing and the account available funds
    const accountStatus = await jormungandrApi.getAccountStatus(
      fastify.config.JORMUNGANDR_API,
      uint8array_to_hex(secretKey.to_public().as_bytes())
    );

    const available_funds = accountStatus.value;
    if (inputAmount > available_funds) {
      reply
        .code(503)
        .send('No funds available in faucet account');
      return;
    }

    const input = Input.from_account(
      faucetAccount,
      Value.from_str(inputAmount.toString())
    );

    iobuilder.add_input(input);

    iobuilder.add_output(
      Address.from_string(request.params.destinationAddress),
      Value.from_str(fastify.config.LOVELACES_TO_GIVE.toString())
    );

    const feeAlgorithm = Fee.linear_fee(
      Value.from_str(nodeSettings.fees.constant.toString()),
      Value.from_str(nodeSettings.fees.coefficient.toString()),
      Value.from_str(nodeSettings.fees.certificate.toString())
    );

    // The amount is exact, that's why we use `forget()`
    const IOs = iobuilder.seal_with_output_policy(
      Payload.no_payload(),
      feeAlgorithm,
      OutputPolicy.forget()
    );

    const builderSetWitness = new TransactionBuilder()
      .no_payload()
      .set_ios(IOs.inputs(), IOs.outputs());

    const witness = Witness.for_account(
      Hash.from_hex(nodeSettings.block0Hash),
      builderSetWitness.get_auth_data_for_witness(),
      secretKey,
      SpendingCounter.from_u32(accountStatus.counter)
    );

    const witnesses = Witnesses.new();
    witnesses.add(witness);

    const signedTx = builderSetWitness
      .set_witnesses(witnesses)
      .set_payload_auth(PayloadAuthData.for_no_payload());

    const message = Fragment.from_transaction(signedTx);

    // Send the transaction
    await jormungandrApi.postMsg(
      fastify.config.JORMUNGANDR_API,
      message.as_bytes()
    );

    reply
      .code(200)
      .send(`transaction id: ${uint8array_to_hex(message.id().as_bytes())}`);
  } catch (err) {
    fastify.log.error(err.message);
  }
});

fastify.register(fastifyEnv, options).ready(err => {
  if (err) fastify.log.error(err);
  start();
});

const start = async () => {
  try {
    await fastify.listen(fastify.config.PORT);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
