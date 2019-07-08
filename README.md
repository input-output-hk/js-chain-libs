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