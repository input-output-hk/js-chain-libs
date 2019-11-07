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

fn mock_io_builder(input: u64, output: u64) -> InputOutputBuilder {
    let mut builder = InputOutputBuilder::empty();

    let txid = FragmentId::from_bytes(&[0]);
    let utxopointer = UtxoPointer::new(txid, 0, input.into());
    let input = Input::from_utxo(&utxopointer);

    builder.add_input(input).unwrap();

    let output_address =
        Address::from_string("ca1qh9u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pj2xk344")
            .unwrap();
    builder.add_output(output_address, output.into()).unwrap();
    builder
}

#[wasm_bindgen_test]
fn transaction_builder_balance() {
    let iobuilder = mock_io_builder(32, 20);
    let fee_algorithm = Fee::linear_fee(2u64.into(), 0u64.into(), 0u64.into());
    let balance = iobuilder.get_balance(None, &fee_algorithm).unwrap();

    assert_eq!(balance.get_sign(), "positive");
    assert_eq!(balance.get_value(), (32u64 - 20 - 2).into());
}

#[wasm_bindgen_test]
fn transaction_builder_finalize_good_case() {
    let iobuilder = mock_io_builder(32, 20);
    let fee_algorithm = Fee::linear_fee(2u64.into(), 0u64.into(), 0u64.into());

    let txbuilder = TransactionBuilder::new();
    let set_payload = txbuilder.no_payload();

    let output_policy = OutputPolicy::forget();
    let ios = iobuilder
        .seal_with_output_policy(None, fee_algorithm, output_policy)
        .unwrap();

    let set_witness = set_payload.set_ios(ios.inputs(), ios.outputs());

    let genesis_hash = Hash::from_bytes(&[0]);

    let txid = set_witness.get_auth_data_for_witness();
    let key = PrivateKey::from_bech32("ed25519e_sk1lzkckzvwh7gn5f0krrmrxlpsywypu3kka2u82l3akm5gr8khra8suz6zv5jcwg8h6jy4pjs4dfvcrja07q9758xctp6cgkn5ykkgj9cts0mef").unwrap();
    let witness = Witness::for_utxo(genesis_hash, txid, key);

    let mut witnesses = Witnesses::new();
    witnesses.add(witness);

    let add_auth_data = set_witness.set_witnesses(witnesses);

    let auth_data = PayloadAuthData::for_no_payload();

    let transaction = add_auth_data.set_payload_auth(auth_data);

    assert!(transaction.is_ok())
}

#[wasm_bindgen_test]
fn io_builder_finalize_not_enough_input() {
    let iobuilder = mock_io_builder(30, 31);

    let fee_algorithm = Fee::linear_fee(2u64.into(), 0u64.into(), 0u64.into());
    let output_policy = OutputPolicy::forget();

    let input_output = iobuilder.seal_with_output_policy(None, fee_algorithm, output_policy);
    assert!(input_output.is_err())
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
    let key = PrivateKey::generate_ed25519().unwrap();
    assert!(key.to_bech32().starts_with("ed25519_"));
}

#[wasm_bindgen_test]
fn generate_private_key_ed25519_extended() {
    let key = PrivateKey::generate_ed25519extended().unwrap();
    assert!(key.to_bech32().starts_with("ed25519e_"));
}

#[wasm_bindgen_test]
fn account_identifier_from_address() {
    let address =
        Address::from_string("ca1skmmqxvaesaew6aygcpkshrs0et80rh6hutkzlt6k6dpgewyarwv7zl5efq")
            .unwrap();

    let account = Account::from_address(&address).unwrap();
    let expected = "b7b0199dcc3b976ba44603685c707e56778efabf17617d7ab69a1465c4e8dccf";
    assert_eq!(account.to_identifier().to_hex(), expected);
}
