//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use js_chain_libs::*;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn account_address_from_string() {
    let address =
        Address::from_string("ca1q09u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pjyknplu");
    assert!(address.is_ok());
}

#[wasm_bindgen_test]
fn single_address_from_string() {
    let address =
        Address::from_string("ca1qh9u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pj2xk344");
    assert!(address.is_ok());
}

#[wasm_bindgen_test]
fn parse_bech32_extended_secret_key() {
    let key = "ed25519e_sk1lzkckzvwh7gn5f0krrmrxlpsywypu3kka2u82l3akm5gr8khra8suz6zv5jcwg8h6jy4pjs4dfvcrja07q9758xctp6cgkn5ykkgj9cts0mef";
    assert!(PrivateKey::from_bech32(key).is_ok());
}

#[wasm_bindgen_test]
fn parse_bech32_normal_secret_key() {
    let key = "ed25519_sk17dvhvjmykpp2xg9arjrvun5fh4zglw63znrzu00hsseq5emruvsq2rzdje";
    assert!(PrivateKey::from_bech32(key).is_ok());
}

fn mock_builder(input: u64, output: u64) -> TransactionBuilder {
    let mut txbuilder = TransactionBuilder::new();
    let txid = TransactionId::from_bytes(&[0]);
    let utxopointer = UtxoPointer::new(txid, 0, input);
    let input = Input::from_utxo(&utxopointer);

    txbuilder.add_input(input);

    let output_address =
        Address::from_string("ca1qh9u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pj2xk344")
            .unwrap();
    let value = Value::from_u64(output);
    txbuilder.add_output(output_address, value);
    txbuilder
}

#[wasm_bindgen_test]
fn transaction_builder_balance() {
    let txbuilder = mock_builder(32, 20);
    let fee_algorithm = Fee::linear_fee(2, 0, 0);
    let balance = txbuilder.get_balance(&fee_algorithm).unwrap();

    assert_eq!(balance.get_sign(), "positive");
    assert_eq!(balance.get_value(), Value::from_u64(32 - 20 - 2));
}

#[wasm_bindgen_test]
fn transaction_builder_finalize_good_case() {
    let txbuilder = mock_builder(32, 20);
    let fee_algorithm = Fee::linear_fee(2, 0, 0);
    let output_policy = OutputPolicy::forget();

    let transaction = txbuilder.finalize(&fee_algorithm, output_policy);
    assert!(transaction.is_ok())
}

#[wasm_bindgen_test]
fn transaction_builder_finalize_not_enough_input() {
    let txbuilder = mock_builder(30, 31);

    let fee_algorithm = Fee::linear_fee(2, 0, 0);
    let output_policy = OutputPolicy::forget();

    let transaction = txbuilder.finalize(&fee_algorithm, output_policy);
    assert!(transaction.is_err())
}

#[wasm_bindgen_test]
fn transaction_finalizer() {
    let txbuilder = mock_builder(10, 5);

    let tx = txbuilder.unchecked_finalize();

    let mut finalizer = TransactionFinalizer::new(tx);
    let genesis_hash = Hash::from_bytes(&[0]);
    let txid = finalizer.get_txid();
    let key = PrivateKey::from_bech32("ed25519e_sk1lzkckzvwh7gn5f0krrmrxlpsywypu3kka2u82l3akm5gr8khra8suz6zv5jcwg8h6jy4pjs4dfvcrja07q9758xctp6cgkn5ykkgj9cts0mef").unwrap();
    let witness = Witness::for_utxo(genesis_hash, txid, key);
    assert!(finalizer.set_witness(0, witness).is_ok());
    assert!(finalizer.build().is_ok())
}
