// Require the framework and instantiate it
/* global BigInt */
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
      TransactionFinalizer,
      Fragment,
      PrivateKey,
      Witness,
      SpendingCounter,
      Hash,
      Account,
      // eslint-disable-next-line camelcase
      uint8array_to_hex
    } = await chainLibs;

    // From the settings we can get:
    // the block0hash used for signing
    // the transaction fees
    const nodeSettings = await jormungandrApi.getNodeSettings(
      fastify.config.JORMUNGANDR_API
    );

    const txbuilder = new TransactionBuilder();

    const secretKey = PrivateKey.from_bech32(fastify.config.SECRET_KEY);
    const faucetAccount = Account.from_public_key(secretKey.to_public());

    // Fee (#inputs + #outputs) * coefficient + constant + #certificates*certificate
    // #inputs = 1; #outputs = 2; #certificates = 0
    const computedFee =
      (1 + 1) * nodeSettings.fees.coefficient + nodeSettings.fees.constant;
    const input = Input.from_account(
      faucetAccount,
      Value.from_u64(BigInt(fastify.config.LOVELACES_TO_GIVE + computedFee))
    );

    txbuilder.add_input(input);

    txbuilder.add_output(
      Address.from_string(request.params.destinationAddress),
      Value.from_u64(BigInt(fastify.config.LOVELACES_TO_GIVE))
    );

    const feeAlgorithm = Fee.linear_fee(
      BigInt(nodeSettings.fees.constant),
      BigInt(nodeSettings.fees.coefficient),
      BigInt(nodeSettings.fees.certificate)
    );

    // The amount is exact, that's why we use `forget()`
    const finalizedTx = txbuilder.finalize(feeAlgorithm, OutputPolicy.forget());

    const finalizer = new TransactionFinalizer(finalizedTx);

    // To get the account counter used for signing
    const accountStatus = await jormungandrApi.getAccountStatus(
      fastify.config.JORMUNGANDR_API,
      uint8array_to_hex(secretKey.to_public().as_bytes())
    );

    const witness = Witness.for_account(
      Hash.from_hex(nodeSettings.block0Hash),
      finalizer.get_txid(),
      secretKey,
      SpendingCounter.from_u32(accountStatus.counter)
    );

    finalizer.set_witness(0, witness);

    const signedTx = finalizer.build();

    const message = Fragment.from_generated_transaction(signedTx);

    // Send the transaction
    await jormungandrApi.postMsg(
      fastify.config.JORMUNGANDR_API,
      message.as_bytes()
    );

    // Return the encoded signed transaction
    reply.send(
      uint8array_to_hex(
        message
          .get_transaction()
          .id()
          .as_bytes()
      )
    );
  } catch (err) {
    fastify.log.error(err);
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
