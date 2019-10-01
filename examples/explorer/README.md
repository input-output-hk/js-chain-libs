# Basic Explorer

A simple Cardano Explorer using Reactjs, React-bootstrap and Relay to use with Jorgunmandr node.

# Prerequesites

- You need a Jormungandr node running in explorer mode in order to use this app. You You can learn how to run Jormungandr in Explorer mode [here](https://input-output-hk.github.io/jormungandr/quickstart/04_explorer.html).

# Install dependencies

- Use nodejs v8.16: `nvm install 8.16.0 && nvm use 8.16.0` or you can just run `nvm use` in the root of the project.
- Node dependencies: `npm install`

# Configure

- Put the Jormungandr's Explorer API URL into the configuration file in `src/config.json` in the `explorerUrl` key. To learn where to get this URL you can take a look [here](https://input-output-hk.github.io/jormungandr/quickstart/03_rest_api.html)

# Build

- This application needs to build some file before run. Do it with:
  `npm run relay`

# Run

- Run `npm start`

# Test

- TODO
