//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use js_chain_libs::*;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn account_address_from_string() {
    let address = Address::from_string("ca1q09u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pjyknplu");
    assert!(address.is_ok());
}

#[wasm_bindgen_test]
fn single_address_from_string() {
    let address = Address::from_string("ca1qh9u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pj2xk344");
    assert!(address.is_ok());
}

#[wasm_bindgen_test]
fn transaction_builder() {
    let mut txbuilder = TransactionBuilder::new();
    let txid = TransactionId::from_bytes(&[0]);
    let utxopointer = UtxoPointer::new(txid, 0, 32);
    let input = Input::from_utxo(&utxopointer);

    txbuilder.add_input(input);

    let output_address = Address::from_string("ca1qh9u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pj2xk344").unwrap();
    let value = Value::from_u64(20);
    txbuilder.add_output(output_address, value);

    let fee_algorithm = Fee::linear_fee(2, 0, 0);
    let balance = txbuilder.get_balance(&fee_algorithm).unwrap();

    assert_eq!(balance.get_sign(), "positive");
    assert_eq!(balance.get_value(), Value::from_u64(32 - 20 - 2));
}
