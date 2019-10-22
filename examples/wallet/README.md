# Cardano wallet example

this is based on: [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

This is a light wallet, it does not run its own node, and depends on one running on `localhost:8433`.
The node address will be configurable in the future 🙃

## development tools

- `yarn install`: install dependencies
- `yarn dev`: to run the app with a debugger
- `yarn lint`: lint js files with eslint
- `yarn lint-styles`: lint css files with stylelint
- `yarn flow`: check [flow](https://flow.org/) type annotations

To run the application in development mode, first install the dependencies with
`yarn install` and then run it with `yarn dev`.

To build an appimage package, first install the dependencies with
`yarn install` and then package the app with `yarn package-{linux,win}`

## TODO

- [ x ] show the balance of a given address
- [ ] verify the validity of an address before making a request to the a node (js bindings will be added here, ideally, before tackling any more complex issues such as creating transactione)
  - [ x ] add js-chain-libs bindings
  - [ ] handle errors in address format
- [ x ] let the user use its private key.
  - [ x ] prompt the user for its private key, ideally locking parts of the app until a valid one is inserted
  - [ ] bip39?
- [ x ] send account-based transactions
  - [ x ] UI
  - [ x ] verify validity of the recipient's address
  - [ x ] update sender's account counter
  - [ x ] generate transaction
    - [ x ] add output
    - [ x ] add witness
  - [ x ] broadcast transaction
- [ ] make configurable via settings file:
  - [ ] node address
  - [ ] address prefix
  - [ ] network discriminator
- [ ] locally store the user's private key
  - [ ] define a password schema for unlocking the app (so the funds are secure if the user's device is used by someone else)
  - [ ] define a password schema for encrypting the private keys(so the funds are secure if the device's storage is compromised)
- [ ] view mode?
- [ ] list user transactions and their status?

## Tech debt

- [ ] extract flow types from the js-chain-libs with [flowtype](https://github.com/joarwilk/flowgen), and have a module that exports them and abstracts the initialization of the wasm
- [ ] research: Is the mechanism for importing wasm smart enough to not load it
      several times into memory if it is imported in more than one place?
  - [ ] if it is not, have the aforementioned module take care of
        initializing it only one time.
