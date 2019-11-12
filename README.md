# js chain libs

WebAssembly library with Javascript bindings to the new chain libraries.

This library can be used to do things like: create addresses, transactions and certificates, an encode them to be able to post to a node. It can also be used to parse the data fetched from a node (such as blocks).
A possible use-case is for building explorers and wallets in javascript, either in the browser or in nodejs, making possible to build engaging blockchain apps with good user interfaces with the same low level primitives already used in the rust node.

## Installing from npmjs

```
npm i --save js-chain-libs
```

## Building from source

### Requirements

- Install [rustup](https://rustup.rs/)
- Run rustup install stable
- Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

Make sure to update the submodule:

```sh
git submodule init
git submodule update
```

Build with:

``` sh
wasm-pack build
```

Creating an npm module:

```sh
wasm-pack pack
```

## Examples

Check the [wallet example](./examples/wallet/app/utils/wasmWrapper.js) to see how to use this bindings in electron

Check the [example faucet](./examples/faucet/server.js) to see how to use this bindings in node.

## Testing

Run the tests with

```sh
wasm-pack test --headless --chrome
```

Bundle javascript tests to run in browser 

```sh
npm run serve
```

Go to `http://127.0.0.1:8080/` to see the results.

# Documentation

Run `npm run doc` on this repository to generate the [jsdoc](https://jsdoc.app/) documentation from the build,the actual files are generated in the `docs` directory.
