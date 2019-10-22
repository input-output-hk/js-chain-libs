# Jormungandr Explorer

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

# General design

This explorer is a Frontend ReactJS application that utilizes a GraphQL backend with a specified Schema. In normal scenarios is meant to be uses Jormungandr node as the Backend.

# Main directories

- `data`: Here you can find the GraphQl schema of the server we are using, it should stay update with the server for Relay to work properly. Anyway, you can extend server's schema.
- `src/graphql`: This directory contains objects related with Graphql Relay. This includes `environment`, `fetchData` and all queries that the application need to use when wrapping components.
- `components/general`: This directory contains the three more general components in the app page.
- `components/mainSection`: MainSection directory contains all the components that will be shown in the MainSection part of the page. This includes all search results and RecentBlocks components
- `Address`, `Block`, `Certificate`, `Epoch`, `StakePool`, `Status` and `Transaction` directories contains components that shows information of each entity. For example, each directory contains an Info component that contains the basic entity information, and a FullEntityInfo components that contains more complex info.
- `commons`: This directory holds multiple components usefull for all sections of the application.
- `helpers`: Self-described.

# QueryWrapper

QueryWrapper is a component that wraps a child component giving it some functionalities:

- It adds Relay's QueryRenderer functionality with the specified query.
- It renders the wrapped component in case of success or other components in case of failure.
