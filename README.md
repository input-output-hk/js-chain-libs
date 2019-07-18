# Js chain libs

WebAssembly library with Javascript bindings to the new chain libraries 

## Building 

### Requirements

Install [rustup](https://rustup.rs/)
Run rustup install stable
Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

```sh
wasm-pack build
```

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