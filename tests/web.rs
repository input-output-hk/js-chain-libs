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
    let txid = FragmentId::from_bytes(&[0]);
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

#[wasm_bindgen_test]
fn stake_delegation_certificate() {
    let stake_pool_id =
        StakePoolId::from_hex("541db50349e2bc1a5b1a73939b9d86fc45067117cc930c36afbb6fb0a9329d41")
            .unwrap();
    let public_key = PublicKey::from_bech32(
        "ed25519_pk1ycaqtzewdqtmevzcu9e5mgup4x27xv6u8c2sm5kkyxeuzdj402ns0uny5a",
    )
    .unwrap();
    let certificate = Certificate::stake_delegation(stake_pool_id, public_key);
    let mut txbuilder = mock_builder(30, 20);
    assert!(txbuilder.set_certificate(certificate).is_ok());
}

#[wasm_bindgen_test]
fn account_address_from_public_key() {
    let public_key = PublicKey::from_bech32(
        "ed25519_pk1kj8yvfrh5tg7n62kdcw3kw6zvtcafgckz4z9s6vc608pzt7exzys4s9gs8",
    )
    .unwrap();
    let discriminant = AddressDiscrimination::Test;
    let address = Address::account_from_public_key(public_key, discriminant);
    assert_eq!(
        address.to_string("ta"),
        "ta1sk6gu33yw73dr60f2ehp6xemgf30r49rzc25gkrfnrfuuyf0mycgjm9vc4c"
    );
}

#[wasm_bindgen_test]
fn single_address_from_public_key() {
    let public_key = PublicKey::from_bech32(
        "ed25519_pk1kj8yvfrh5tg7n62kdcw3kw6zvtcafgckz4z9s6vc608pzt7exzys4s9gs8",
    )
    .unwrap();
    let discriminant = AddressDiscrimination::Test;
    let address = Address::single_from_public_key(public_key, discriminant);
    assert_eq!(
        address.to_string("ta"),
        "ta1sw6gu33yw73dr60f2ehp6xemgf30r49rzc25gkrfnrfuuyf0mycgj44fgl3"
    );
}

#[wasm_bindgen_test]
fn delegation_address_from_public_key() {
    let public_key = PublicKey::from_bech32(
        "ed25519_pk1kj8yvfrh5tg7n62kdcw3kw6zvtcafgckz4z9s6vc608pzt7exzys4s9gs8",
    )
    .unwrap();
    let account_key = PublicKey::from_bech32(
        "ed25519_pk1e0rueku628h2fex8pzp48sdpjqku76zlwwgefhyl4lexkl6zugvs0uuy0w",
    )
    .unwrap();
    let discriminant = AddressDiscrimination::Test;
    let address = Address::delegation_from_public_key(public_key, account_key, discriminant);
    assert_eq!(
        address.to_string("ta"),
        "ta1sj6gu33yw73dr60f2ehp6xemgf30r49rzc25gkrfnrfuuyf0mycgnj78ende550w5njvwzyr20q6rypdea597uu3jnwfltljddl59cseaq7yn9"
    );
}

#[wasm_bindgen_test]
fn generate_private_key_ed25519_normal() {
    assert!(PrivateKey::generate_ed25519().is_ok());
}

#[wasm_bindgen_test]
fn generate_private_key_ed25519_extended() {
    assert!(PrivateKey::generate_ed25519extended().is_ok());
}
