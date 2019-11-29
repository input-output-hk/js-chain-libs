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

## Regeneration of proto files

The javascript files generated from the `.proto` file are checked into source
control. Upon changes to the node's gRPC API, it's necessary to regenerate them.
It's necessary to have protoc (packaged as `protobuf-container` on debian) and
[protoc-gen-grpc-web](https://github.com/grpc/grpc-web) installed

generate the protobuffer interface:

```
protoc -I=../../chain-libs/network-grpc/proto node.proto --js_out=import_style=commonjs:app/generated
```

generate the gRPC-web interface:

```
protoc -I=../../chain-libs/network-grpc/proto node.proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:app/generated
```

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
  - [ x ] address prefix
  - [ x ] network discriminator
- [ ] locally store the user's private key
  - [ ] define a password schema for unlocking the app (so the funds are secure if the user's device is used by someone else)
  - [ ] define a password schema for encrypting the private keys(so the funds are secure if the device's storage is compromised)
- [ ] view mode?
- [ ] list user transactions and their status
  - [ ] display transactions
    - [ ] transaction type
      - [ x ] send
      - [ ] receive
      - [ x ] delegate
    - [ x ] 'other' 'address' (is the pool id in the case of a delegation)
    - [ ] transaction date
    - [ ] transaction details dropdown
      - [ ] 'from' addresses and amounts
      - [ ] 'to' addresses and amounts
      - [ ] fee
      - [ ] certificate details?
    - [ ] transaction status
  - [ x ] optimistic UI: insert a transaction when delegating
  - [ x ] optimistic UI: insert a transaction when sending funds
  - [ ] fetch transactions from the node.
    - [ ] update status of existing transactions.
- [ ] connect to the node using the gRPC API
- [ ] generate delegation transaction
  - [ ] set the delegated pool optimistically

## Tech debt

- [ ] extract flow types from the js-chain-libs with [flowtype](https://github.com/joarwilk/flowgen), and have a module that exports them and abstracts the initialization of the wasm
- [ ] research: Is the mechanism for importing wasm smart enough to not load it
      several times into memory if it is imported in more than one place?
  - [ ] if it is not, have the aforementioned module take care of
        initializing it only one time.
- [ ] use react-connected-router
  - [ ] tangible issue: redirect to the next screens in account restoration
        only if there weren't any issues in the account's action.
  - [ ] use redux actions instead of `useHistory`
