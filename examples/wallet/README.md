# Cardano wallet example

this is based on: [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

This is a light wallet, it does not run its own node, and depends on one running on `localhost:8433`.
The node address will be configurable in the future 🙃

## development tools
* `npm run dev`: to run the app with a debugger
* `npm run lint`: lint js files with eslint
* `npm run lint-styles`: lint css files with stylelint
* `npm run flow`: check [flow](https://flow.org/) type annotations

## TODO
- [ x ] show the balance of a given address
- [  ] verify the validity of an address before making a request to the a node (js bindings will be added here, ideally, before tackling any more complex issues such as creating transactione)
- [  ] let the user use its private key.
    - [  ] prompt the user for its private key, ideally locking parts of the app until a valid one is inserted
    - [  ] bip39?
- [  ] send account-based transactions
    - [  ] UI
    - [  ] verify validity of the recipient's address
    - [  ] update sender's account counter
    - [  ] generate transaction
        - [  ] add output
        - [  ] add witness
    - [  ] broadcast transaction
- [  ] locally store the user's private key
    - [  ] define a password schema for unlocking the app (so the funds are secure if the user's device is used by someone else)
    - [  ] define a password schema for encrypting the private keys(so the funds are secure if the device's storage is compromised)
- [  ] view mode?
- [  ] list user transactions and their status?
