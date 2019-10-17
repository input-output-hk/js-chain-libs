# Basic Explorer

A simple Explorer using Reactjs, React-bootstrap and Relay to use with Jorgunmandr node.

# What does this Explorer have/ do?

- Transaction search by Hash.
- Block search by hash.
- Block search by chain length.
- Epoch search by Epoch number.
- Stake pool search by Pool id.
- Address search by Address.
- Block table showing all blocks ordered from more recents to older.

# What does this explorer not have (and should have)?

- Logging tool.
- Automated tests.
- Complete responsiveness.
- Accessing to blocks table by page number.

# Prerequesites

- You need a Jormungandr node running in explorer mode in order to use this app. You can learn how to run Jormungandr in Explorer mode [here](https://input-output-hk.github.io/jormungandr/quickstart/04_explorer.html).

- Also you need the Jormungandr node to have CORS enabled and have the correct origin added to the `allowed_origins` list. More information on this [here](https://input-output-hk.github.io/jormungandr/configuration/network.html#rest-interface-configuration)

# Install dependencies

- Use nodejs v8.16: `nvm install 8.16.0 && nvm use 8.16.0` or you can just run `nvm use` in the root of the project.
- Node dependencies: `npm install`

# Configure

- You can change `src/config.json` to configure the application:
  - `explorerUrl`: The URL of the Jormungandr's Explorer API. To learn where to get this URL you can take a look [here](https://input-output-hk.github.io/jormungandr/quickstart/03_rest_api.html)
  - `currency`: In this key there are configuration about the used currency.
    - `symbol`: Symbol of the currency. It will be displayed next to every value amount in the app.
    - `decimals`: Currency decimals. For Cardano, the value is 6.
  - `networkSettings`: Configurations of the network that are necesary for the explorer to work.
    - `genesisTimestamp`: Genesis block timestamp. Used to calculate block dates.
    - `slotsPerEpoch`: Amount of blocks in each epoch. Used to calculate block dates.
    - `slotDuration`: Duration of slots in seconds. Used to calculate block dates.
  - `assuranceLevels`: Defines the amount of confirmations needed for a transaction to meet a specific level. Any transaction with a level of confirmation below `low`, will be considered unconfirmed. There are three configurable levels:
    - `low`
    - `medium`
    - `high`

# Build

- This application needs to build some file before run. Do it with:
  `npm run relay`

# Run

- Run `npm start`

# Test

- TODO
