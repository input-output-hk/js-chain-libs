#[macro_use]
mod transaction;
#[macro_use]
mod utils;

use bech32::{Bech32, ToBase32 as _};
use chain::{account, certificate, fee, key, transaction as tx, value};
use chain_core::property::Block as _;
use chain_core::property::Deserialize as _;
use chain_core::property::Fragment as _;
use chain_core::property::Serialize;
use chain_crypto as crypto;
use chain_impl_mockchain as chain;
use crypto::bech32::Bech32 as _;
use hex;
use js_sys::Uint8Array;
use rand_os::OsRng;
use std::convert::TryFrom;
use std::ops::{Add, Sub};
use std::str::FromStr;
use wasm_bindgen::prelude::*;

pub use transaction::*;

/// ED25519 signing key, either normal or extended
#[wasm_bindgen]
pub struct PrivateKey(key::EitherEd25519SecretKey);

impl From<key::EitherEd25519SecretKey> for PrivateKey {
    fn from(secret_key: key::EitherEd25519SecretKey) -> PrivateKey {
        PrivateKey(secret_key)
    }
}

#[wasm_bindgen]
impl PrivateKey {
    /// Get private key from its bech32 representation
    /// ```javascript
    /// PrivateKey.from_bech32(&#39;ed25519_sk1ahfetf02qwwg4dkq7mgp4a25lx5vh9920cr5wnxmpzz9906qvm8qwvlts0&#39;);
    /// ```
    /// For an extended 25519 key
    /// ```javascript
    /// PrivateKey.from_bech32(&#39;ed25519e_sk1gqwl4szuwwh6d0yk3nsqcc6xxc3fpvjlevgwvt60df59v8zd8f8prazt8ln3lmz096ux3xvhhvm3ca9wj2yctdh3pnw0szrma07rt5gl748fp&#39;);
    /// ```
    pub fn from_bech32(bech32_str: &str) -> Result<PrivateKey, JsValue> {
        crypto::SecretKey::try_from_bech32_str(&bech32_str)
            .map(key::EitherEd25519SecretKey::Extended)
            .or_else(|_| {
                crypto::SecretKey::try_from_bech32_str(&bech32_str)
                    .map(key::EitherEd25519SecretKey::Normal)
            })
            .map(PrivateKey)
            .map_err(|_| JsValue::from_str("Invalid secret key"))
    }

    pub fn to_public(&self) -> PublicKey {
        self.0.to_public().into()
    }

    pub fn generate_ed25519() -> Result<PrivateKey, JsValue> {
        OsRng::new()
            .map(crypto::SecretKey::<crypto::Ed25519>::generate)
            .map(key::EitherEd25519SecretKey::Normal)
            .map(PrivateKey)
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
    }

    pub fn generate_ed25519extended() -> Result<PrivateKey, JsValue> {
        OsRng::new()
            .map(crypto::SecretKey::<crypto::Ed25519Extended>::generate)
            .map(key::EitherEd25519SecretKey::Extended)
            .map(PrivateKey)
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
    }

    pub fn to_bech32(&self) -> String {
        match self.0 {
            key::EitherEd25519SecretKey::Normal(ref secret) => secret.to_bech32_str(),
            key::EitherEd25519SecretKey::Extended(ref secret) => secret.to_bech32_str(),
        }
    }

    pub fn from_extended_bytes(bytes: &[u8]) -> Result<PrivateKey, JsValue> {
        crypto::SecretKey::from_binary(bytes)
            .map(key::EitherEd25519SecretKey::Extended)
            .map(PrivateKey)
            .map_err(|_| JsValue::from_str("Invalid extended secret key"))
    }

    pub fn from_normal_bytes(bytes: &[u8]) -> Result<PrivateKey, JsValue> {
        crypto::SecretKey::from_binary(bytes)
            .map(key::EitherEd25519SecretKey::Normal)
            .map(PrivateKey)
            .map_err(|_| JsValue::from_str("Invalid normal secret key"))
    }
}

/// ED25519 key used as public key
#[wasm_bindgen]
#[derive(Clone)]
pub struct PublicKey(crypto::PublicKey<crypto::Ed25519>);

impl From<crypto::PublicKey<crypto::Ed25519>> for PublicKey {
    fn from(key: crypto::PublicKey<crypto::Ed25519>) -> PublicKey {
        PublicKey(key)
    }
}

#[wasm_bindgen]
impl PublicKey {
    /// Get private key from its bech32 representation
    /// Example:
    /// ```javascript
    /// const pkey = PublicKey.from_bech32(&#39;ed25519_pk1dgaagyh470y66p899txcl3r0jaeaxu6yd7z2dxyk55qcycdml8gszkxze2&#39;);
    /// ```
    pub fn from_bech32(bech32_str: &str) -> Result<PublicKey, JsValue> {
        crypto::PublicKey::try_from_bech32_str(&bech32_str)
            .map(PublicKey)
            .map_err(|_| JsValue::from_str("Malformed public key"))
    }

    pub fn as_bytes(&self) -> Vec<u8> {
        self.0.as_ref().to_vec()
    }

    pub fn from_bytes(bytes: &[u8]) -> Result<PublicKey, JsValue> {
        crypto::PublicKey::from_binary(bytes)
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
            .map(PublicKey)
    }
}

#[wasm_bindgen]
pub struct PublicKeys(Vec<PublicKey>);

#[wasm_bindgen]
impl PublicKeys {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PublicKeys {
        PublicKeys(vec![])
    }

    pub fn size(&self) -> usize {
        self.0.len()
    }

    pub fn get(&self, index: usize) -> PublicKey {
        self.0[index].clone()
    }

    pub fn add(&mut self, key: PublicKey) {
        self.0.push(key);
    }
}

//-----------------------------//
//----------Address------------//
//-----------------------------//

/// An address of any type, this can be one of
/// * A utxo-based address without delegation (single)
/// * A utxo-based address with delegation (group)
/// * An address for an account
#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Address(chain_addr::Address);

#[wasm_bindgen]
impl Address {
    //XXX: Maybe this should be from_bech32?
    /// Construct Address from its bech32 representation
    /// Example
    /// ```javascript
    /// const address = Address.from_string(&#39;ca1q09u0nxmnfg7af8ycuygx57p5xgzmnmgtaeer9xun7hly6mlgt3pjyknplu&#39;);
    /// ```
    pub fn from_string(s: &str) -> Result<Address, JsValue> {
        chain_addr::AddressReadable::from_string_anyprefix(s)
            .map(|address_readable| Address(address_readable.to_address()))
            .map_err(|e| JsValue::from_str(&format! {"{:?}", e}))
    }

    /// Get Address bech32 (string) representation with a given prefix
    /// ```javascript
    /// let public_key = PublicKey.from_bech32(
    ///     &#39;ed25519_pk1kj8yvfrh5tg7n62kdcw3kw6zvtcafgckz4z9s6vc608pzt7exzys4s9gs8&#39;
    /// );
    /// let discriminant = AddressDiscrimination.Test;
    /// let address = Address.single_from_public_key(public_key, discriminant);
    /// address.to_string(&#39;ta&#39;)
    /// // ta1sj6gu33yw73dr60f2ehp6xemgf30r49rzc25gkrfnrfuuyf0mycgnj78ende550w5njvwzyr20q6rypdea597uu3jnwfltljddl59cseaq7yn9
    /// ```
    pub fn to_string(&self, prefix: &str) -> String {
        format!(
            "{}",
            chain_addr::AddressReadable::from_address(prefix, &self.0)
        )
    }

    /// Construct a single non-account address from a public key
    /// ```javascript
    /// let public_key = PublicKey.from_bech32(
    ///     &#39;ed25519_pk1kj8yvfrh5tg7n62kdcw3kw6zvtcafgckz4z9s6vc608pzt7exzys4s9gs8&#39;
    /// );
    /// let address = Address.single_from_public_key(public_key, AddressDiscrimination.Test);
    /// ```
    pub fn single_from_public_key(
        key: PublicKey,
        discrimination: AddressDiscrimination,
    ) -> Address {
        chain_addr::Address(discrimination.into(), chain_addr::Kind::Single(key.0)).into()
    }

    /// Construct a non-account address from a pair of public keys, delegating founds from the first to the second
    pub fn delegation_from_public_key(
        key: PublicKey,
        delegation: PublicKey,
        discrimination: AddressDiscrimination,
    ) -> Address {
        chain_addr::Address(
            discrimination.into(),
            chain_addr::Kind::Group(key.0, delegation.0),
        )
        .into()
    }

    /// Construct address of account type from a public key
    pub fn account_from_public_key(
        key: PublicKey,
        discrimination: AddressDiscrimination,
    ) -> Address {
        chain_addr::Address(discrimination.into(), chain_addr::Kind::Account(key.0)).into()
    }
}

impl From<chain_addr::Address> for Address {
    fn from(address: chain_addr::Address) -> Address {
        Address(address)
    }
}

/// Allow to differentiate between address in
/// production and testing setting, so that
/// one type of address is not used in another setting.
/// Example
/// ```javascript
/// let discriminant = AddressDiscrimination.Test;
/// let address = Address::single_from_public_key(public_key, discriminant);
/// ```
#[wasm_bindgen]
pub enum AddressDiscrimination {
    Production,
    Test,
}

impl Into<chain_addr::Discrimination> for AddressDiscrimination {
    fn into(self) -> chain_addr::Discrimination {
        match self {
            AddressDiscrimination::Production => chain_addr::Discrimination::Production,
            AddressDiscrimination::Test => chain_addr::Discrimination::Test,
        }
    }
}

impl_collection!(Outputs, Output);
impl_collection!(Inputs, Input);
impl_collection!(Fragments, Fragment);

/// Helper to add change addresses when finalizing a transaction, there are currently two options
/// * forget: use all the excess money as fee
/// * one: send all the excess money to the given address
#[wasm_bindgen]
pub struct OutputPolicy(tx::OutputPolicy);

impl From<tx::OutputPolicy> for OutputPolicy {
    fn from(output_policy: tx::OutputPolicy) -> OutputPolicy {
        OutputPolicy(output_policy)
    }
}

#[wasm_bindgen]
impl OutputPolicy {
    /// don't do anything with the excess money in transaction
    pub fn forget() -> OutputPolicy {
        tx::OutputPolicy::Forget.into()
    }

    /// use the given address as the only change address
    pub fn one(address: Address) -> OutputPolicy {
        tx::OutputPolicy::One(address.0).into()
    }
}

/// Type for representing the hash of a Transaction, necessary for signing it
#[wasm_bindgen]
pub struct TransactionSignDataHash(tx::TransactionSignDataHash);

#[wasm_bindgen]
impl TransactionSignDataHash {
    pub fn from_bytes(bytes: &[u8]) -> Result<TransactionSignDataHash, JsValue> {
        tx::TransactionSignDataHash::try_from(bytes)
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
            .map(|digest| digest.into())
    }

    pub fn from_hex(input: &str) -> Result<TransactionSignDataHash, JsValue> {
        tx::TransactionSignDataHash::from_str(input)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
            .map(TransactionSignDataHash)
    }

    pub fn as_bytes(&self) -> Vec<u8> {
        self.0.as_ref().to_vec()
    }
}

impl From<tx::TransactionSignDataHash> for TransactionSignDataHash {
    fn from(txid: tx::TransactionSignDataHash) -> TransactionSignDataHash {
        TransactionSignDataHash(txid)
    }
}

/// Type for representing a generic Hash
#[wasm_bindgen]
pub struct Hash(key::Hash);

impl From<key::Hash> for Hash {
    fn from(hash: key::Hash) -> Hash {
        Hash(hash)
    }
}

#[wasm_bindgen]
impl Hash {
    pub fn from_bytes(bytes: &[u8]) -> Hash {
        key::Hash::hash_bytes(bytes).into()
    }

    pub fn from_hex(hex_string: &str) -> Result<Hash, JsValue> {
        key::Hash::from_str(hex_string)
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
            .map(Hash)
    }

    pub fn as_bytes(&self) -> Vec<u8> {
        self.0.serialize_as_vec().unwrap()
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Input(tx::Input);

impl From<tx::Input> for Input {
    fn from(input: tx::Input) -> Input {
        Input(input)
    }
}

/// Generalized input which have a specific input value, and
/// either contains an account reference or a TransactionSignDataHash+index
///
/// This uniquely refer to a specific source of value.
#[wasm_bindgen]
impl Input {
    pub fn from_utxo(utxo_pointer: &UtxoPointer) -> Self {
        Input(tx::Input::from_utxo(utxo_pointer.0))
    }

    pub fn from_account(account: &Account, v: Value) -> Self {
        let identifier = account.to_identifier();
        Input(tx::Input::from_account(identifier.0, v.0))
    }

    /// Get the kind of Input, this can be either "Account" or "Utxo"
    pub fn get_type(&self) -> String {
        match self.0.get_type() {
            tx::InputType::Account => "Account".to_string(),
            tx::InputType::Utxo => "Utxo".to_string(),
        }
    }

    pub fn is_account(&self) -> bool {
        match self.0.get_type() {
            tx::InputType::Account => true,
            _ => false,
        }
    }

    pub fn is_utxo(&self) -> bool {
        match self.0.get_type() {
            tx::InputType::Utxo => true,
            _ => false,
        }
    }

    pub fn value(&self) -> Value {
        self.0.value().into()
    }

    /// Get the inner UtxoPointer if the Input type is Utxo
    pub fn get_utxo_pointer(&self) -> Result<UtxoPointer, JsValue> {
        match self.0.to_enum() {
            tx::InputEnum::UtxoInput(utxo_pointer) => Ok(utxo_pointer.into()),
            _ => Err(JsValue::from_str("Input is not from utxo")),
        }
    }

    /// Get the source Account if the Input type is Account
    pub fn get_account_identifier(&self) -> Result<AccountIdentifier, JsValue> {
        match self.0.to_enum() {
            tx::InputEnum::AccountInput(account, _) => Ok(AccountIdentifier(account)),
            _ => Err(JsValue::from_str("Input is not from account")),
        }
    }
}

/// Unspent transaction pointer. This is composed of:
/// * the transaction identifier where the unspent output is (a FragmentId)
/// * the output index within the pointed transaction's outputs
/// * the value we expect to read from this output, this setting is added in order to protect undesired withdrawal
/// and to set the actual fee in the transaction.
#[wasm_bindgen]
#[derive(Debug)]
pub struct UtxoPointer(tx::UtxoPointer);

impl From<tx::UtxoPointer> for UtxoPointer {
    fn from(ptr: tx::UtxoPointer) -> UtxoPointer {
        UtxoPointer(ptr)
    }
}

#[wasm_bindgen]
impl UtxoPointer {
    pub fn new(fragment_id: FragmentId, output_index: u8, value: Value) -> UtxoPointer {
        UtxoPointer(tx::UtxoPointer {
            transaction_id: fragment_id.0,
            output_index,
            value: value.0,
        })
    }

    pub fn output_index(&self) -> u8 {
        self.0.output_index
    }

    pub fn fragment_id(&self) -> FragmentId {
        self.0.transaction_id.into()
    }
}

/// This is either an single account or a multisig account depending on the witness type
#[wasm_bindgen]
#[derive(Debug)]
pub struct Account(tx::AccountIdentifier);

impl From<tx::AccountIdentifier> for Account {
    fn from(account_identifier: tx::AccountIdentifier) -> Account {
        Account(account_identifier)
    }
}

#[wasm_bindgen]
impl Account {
    pub fn from_address(address: &Address) -> Result<Account, JsValue> {
        match address.0.kind() {
            chain_addr::Kind::Account(key) => {
                Ok(Account(tx::AccountIdentifier::Single(key.clone().into())))
            }
            chain_addr::Kind::Multisig(id) => {
                Ok(Account(tx::AccountIdentifier::Multi(id.clone().into())))
            }
            _ => Err(JsValue::from_str("Address is not account")),
        }
    }

    pub fn to_address(&self, discriminant: AddressDiscrimination) -> Address {
        let kind = match &self.0 {
            tx::AccountIdentifier::Single(id) => chain_addr::Kind::Account(id.clone().into()),
            tx::AccountIdentifier::Multi(id) => {
                let mut bytes = [0u8; chain_crypto::hash::HASH_SIZE_256];
                bytes.copy_from_slice(id.as_ref());
                chain_addr::Kind::Multisig(bytes)
            }
        };
        chain_addr::Address(discriminant.into(), kind).into()
    }

    pub fn single_from_public_key(key: PublicKey) -> Account {
        Account(tx::AccountIdentifier::Single(key.0.into()))
    }

    pub fn to_identifier(&self) -> AccountIdentifier {
        let unspecified = match &self.0 {
            tx::AccountIdentifier::Single(id) => {
                tx::UnspecifiedAccountIdentifier::from_single_account(id.clone())
            }
            tx::AccountIdentifier::Multi(id) => {
                tx::UnspecifiedAccountIdentifier::from_multi_account(id.clone())
            }
        };

        AccountIdentifier(unspecified)
    }
}

#[wasm_bindgen]
pub struct AccountIdentifier(tx::UnspecifiedAccountIdentifier);

#[wasm_bindgen]
impl AccountIdentifier {
    pub fn to_hex(&self) -> String {
        hex::encode(self.0.as_ref())
    }

    pub fn to_account_single(&self) -> Result<Account, JsValue> {
        self.0
            .to_single_account()
            .ok_or(JsValue::from_str(
                "can't be used as a public key for single account",
            ))
            .map(|acc| Account(tx::AccountIdentifier::Single(acc)))
    }

    pub fn to_account_multi(&self) -> Account {
        Account(tx::AccountIdentifier::Multi(self.0.to_multi_account()))
    }
}

/// Type for representing a Transaction Output, composed of an Address and a Value
#[wasm_bindgen]
#[derive(Clone)]
pub struct Output(tx::Output<chain_addr::Address>);

impl From<tx::Output<chain_addr::Address>> for Output {
    fn from(output: tx::Output<chain_addr::Address>) -> Output {
        Output(output)
    }
}

#[wasm_bindgen]
impl Output {
    pub fn address(&self) -> Address {
        self.0.address.clone().into()
    }

    pub fn value(&self) -> Value {
        self.0.value.into()
    }
}

/// Type used for representing certain amount of lovelaces.
/// It wraps an unsigned 64 bits number.
/// Strings are used for passing to and from javascript,
/// as the native javascript Number type can't hold the entire u64 range
/// and BigInt is not yet implemented in all the browsers
#[wasm_bindgen]
#[derive(Debug, Eq, PartialEq)]
pub struct Value(value::Value);

impl AsRef<u64> for Value {
    fn as_ref(&self) -> &u64 {
        &self.0.as_ref()
    }
}

impl From<u64> for Value {
    fn from(number: u64) -> Value {
        value::Value(number).into()
    }
}

#[wasm_bindgen]
impl Value {
    /// Parse the given string into a rust u64 numeric type.
    pub fn from_str(s: &str) -> Result<Value, JsValue> {
        s.parse::<u64>()
            .map_err(|e| JsValue::from_str(&format! {"{:?}", e}))
            .map(|number| number.into())
    }

    /// Return the wrapped u64 formatted as a string.
    pub fn to_str(&self) -> String {
        format!("{}", self.0)
    }

    pub fn checked_add(&self, other: &Value) -> Result<Value, JsValue> {
        self.0
            .add(other.0)
            .map_err(|e| JsValue::from_str(&format!("{}", &format!("{}", e))))
            .map(Value)
    }

    pub fn checked_sub(&self, other: &Value) -> Result<Value, JsValue> {
        self.0
            .sub(other.0)
            .map_err(|e| JsValue::from_str(&format!("{}", &format!("{}", e))))
            .map(Value)
    }
}

impl From<value::Value> for Value {
    fn from(value: value::Value) -> Value {
        Value(value)
    }
}

#[wasm_bindgen]
pub struct U128(u128);

impl From<u128> for U128 {
    fn from(number: u128) -> U128 {
        U128(number)
    }
}

#[wasm_bindgen]
impl U128 {
    pub fn from_be_bytes(bytes: Uint8Array) -> Result<U128, JsValue> {
        if bytes.length() == std::mem::size_of::<u128>() as u32 {
            let mut slice = [0u8; 16];
            bytes.copy_to(&mut slice);
            Ok(u128::from_be_bytes(slice).into())
        } else {
            Err(JsValue::from_str(&format!(
                "Invalid array length. Found {}, expected: 16",
                bytes.length()
            )))
        }
    }

    pub fn from_le_bytes(bytes: Uint8Array) -> Result<U128, JsValue> {
        if bytes.length() == std::mem::size_of::<u128>() as u32 {
            let mut slice = [0u8; 16];
            bytes.copy_to(&mut slice);
            Ok(u128::from_le_bytes(slice).into())
        } else {
            Err(JsValue::from_str(&format!(
                "Invalid array length. Found {}, expected: 16",
                bytes.length()
            )))
        }
    }

    pub fn from_str(s: &str) -> Result<U128, JsValue> {
        s.parse::<u128>()
            .map_err(|e| JsValue::from_str(&format! {"{:?}", e}))
            .map(U128)
    }

    pub fn to_str(&self) -> String {
        format!("{}", self.0)
    }
}

#[wasm_bindgen]
pub struct Certificate(certificate::Certificate);

impl From<certificate::Certificate> for Certificate {
    fn from(certificate: certificate::Certificate) -> Certificate {
        Certificate(certificate)
    }
}

#[wasm_bindgen]
pub struct PoolRegistration(chain::certificate::PoolRegistration);

impl From<chain::certificate::PoolRegistration> for PoolRegistration {
    fn from(info: chain::certificate::PoolRegistration) -> PoolRegistration {
        PoolRegistration(info)
    }
}

#[wasm_bindgen]
pub struct StakeDelegation(chain::certificate::StakeDelegation);

impl From<chain::certificate::StakeDelegation> for StakeDelegation {
    fn from(info: chain::certificate::StakeDelegation) -> StakeDelegation {
        StakeDelegation(info)
    }
}

#[wasm_bindgen]
/// Set the choice of delegation:
///
/// * No delegation
/// * Full delegation of this account to a specific pool
/// * Ratio of stake to multiple pools
pub struct DelegationType(chain::account::DelegationType);

#[wasm_bindgen]
impl DelegationType {
    pub fn non_delegated() -> Self {
        Self(chain::account::DelegationType::NonDelegated)
    }

    pub fn full(pool_id: PoolId) -> Self {
        Self(chain::account::DelegationType::Full(pool_id.0))
    }

    pub fn ratio(r: DelegationRatio) -> Self {
        Self(chain::account::DelegationType::Ratio(r.0))
    }
}

/// Delegation Ratio type express a number of parts
/// and a list of pools and their individual parts
///
/// E.g. parts: 7, pools: [(A,2), (B,1), (C,4)] means that
/// A is associated with 2/7 of the stake, B has 1/7 of stake and C
/// has 4/7 of the stake.
///
/// It's invalid to have less than 2 elements in the array,
/// and by extension parts need to be equal to the sum of individual
/// pools parts.
#[wasm_bindgen]
pub struct DelegationRatio(chain::account::DelegationRatio);

#[wasm_bindgen]
#[derive(Clone)]
pub struct PoolDelegationRatio {
    pool: PoolId,
    part: u8,
}

#[wasm_bindgen]
impl PoolDelegationRatio {
    //TODO: Add constructor attribute
    pub fn new(pool: PoolId, part: u8) -> PoolDelegationRatio {
        Self { pool, part }
    }
}

impl_collection!(PoolDelegationRatios, PoolDelegationRatio);

#[wasm_bindgen]
impl DelegationRatio {
    //TODO: Add constructor attribute
    pub fn new(parts: u8, pools: PoolDelegationRatios) -> Option<DelegationRatio> {
        let pools = pools
            .0
            .iter()
            .map(|PoolDelegationRatio { pool, part }| (pool.0.clone(), *part))
            .collect();

        // FIXME: It could be useful to return an error instea of an Option?
        chain::account::DelegationRatio::new(parts, pools).map(Self)
    }
}

#[wasm_bindgen]
impl StakeDelegation {
    /// Create a stake delegation object from account (stake key) to pool_id
    pub fn new(delegation_type: DelegationType, account: PublicKey) -> StakeDelegation {
        certificate::StakeDelegation {
            account_id: tx::UnspecifiedAccountIdentifier::from_single_account(account.0.into()),
            delegation: delegation_type.0,
        }
        .into()
    }
}

#[wasm_bindgen]
impl Certificate {
    /// Create a Certificate for StakeDelegation
    pub fn stake_delegation(stake_delegation: StakeDelegation) -> Certificate {
        certificate::Certificate::StakeDelegation(stake_delegation.0).into()
    }

    /// Create a Certificate for PoolRegistration
    pub fn stake_pool_registration(pool_registration: PoolRegistration) -> Certificate {
        certificate::Certificate::PoolRegistration(pool_registration.0).into()
    }
}

#[wasm_bindgen]
impl PoolRegistration {
    #[wasm_bindgen(constructor)]
    pub fn new(
        serial: U128,
        owners: PublicKeys,
        operators: PublicKeys,
        management_threshold: u8,
        start_validity: TimeOffsetSeconds,
        kes_public_key: KesPublicKey,
        vrf_public_key: VrfPublicKey,
    ) -> PoolRegistration {
        use chain::certificate::PoolPermissions;
        chain::certificate::PoolRegistration {
            serial: serial.0,
            owners: owners.0.into_iter().map(|key| key.0).collect(),
            operators: operators.0.into_iter().map(|key| key.0).collect(),
            permissions: PoolPermissions::new(management_threshold),
            start_validity: start_validity.0,
            // TODO: Hardcoded parameter
            rewards: chain::rewards::TaxType::zero(),
            // TODO: Hardcoded parameter
            reward_account: None,
            keys: chain::leadership::genesis::GenesisPraosLeader {
                kes_public_key: kes_public_key.0,
                vrf_public_key: vrf_public_key.0,
            },
        }
        .into()
    }

    pub fn id(&self) -> PoolId {
        self.0.to_id().into()
    }
}

#[wasm_bindgen]
pub struct TimeOffsetSeconds(chain_time::timeline::TimeOffsetSeconds);

impl From<chain_time::timeline::TimeOffsetSeconds> for TimeOffsetSeconds {
    fn from(inner: chain_time::timeline::TimeOffsetSeconds) -> TimeOffsetSeconds {
        TimeOffsetSeconds(inner)
    }
}

#[wasm_bindgen]
impl TimeOffsetSeconds {
    /// Parse the given string into a 64 bits unsigned number
    pub fn from_string(number: &str) -> Result<TimeOffsetSeconds, JsValue> {
        number
            .parse::<u64>()
            .map_err(|e| JsValue::from_str(&format! {"{:?}", e}))
            .map(chain_time::DurationSeconds)
            .map(|duration| chain_time::timeline::TimeOffsetSeconds::from(duration).into())
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct PoolId(chain::certificate::PoolId);

impl From<chain::certificate::PoolId> for PoolId {
    fn from(pool_id: chain::certificate::PoolId) -> PoolId {
        PoolId(pool_id)
    }
}

#[wasm_bindgen]
impl PoolId {
    pub fn from_hex(hex_string: &str) -> Result<PoolId, JsValue> {
        crypto::Blake2b256::from_str(hex_string)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
            .map(|hash| PoolId(hash.into()))
    }

    pub fn to_string(&self) -> String {
        format!("{}", self.0).to_string()
    }
}

#[wasm_bindgen]
pub struct KesPublicKey(crypto::PublicKey<crypto::SumEd25519_12>);

impl From<crypto::PublicKey<crypto::SumEd25519_12>> for KesPublicKey {
    fn from(kes: crypto::PublicKey<crypto::SumEd25519_12>) -> KesPublicKey {
        KesPublicKey(kes)
    }
}

#[wasm_bindgen]
impl KesPublicKey {
    pub fn from_bech32(bech32_str: &str) -> Result<KesPublicKey, JsValue> {
        crypto::PublicKey::try_from_bech32_str(&bech32_str)
            .map(KesPublicKey)
            .map_err(|_| JsValue::from_str("Malformed kes public key"))
    }
}

#[wasm_bindgen]
pub struct VrfPublicKey(crypto::PublicKey<crypto::Curve25519_2HashDH>);

impl From<crypto::PublicKey<crypto::Curve25519_2HashDH>> for VrfPublicKey {
    fn from(vrf: crypto::PublicKey<crypto::Curve25519_2HashDH>) -> VrfPublicKey {
        VrfPublicKey(vrf)
    }
}

#[wasm_bindgen]
impl VrfPublicKey {
    pub fn from_bech32(bech32_str: &str) -> Result<VrfPublicKey, JsValue> {
        crypto::PublicKey::try_from_bech32_str(&bech32_str)
            .map(VrfPublicKey)
            .map_err(|_| JsValue::from_str("Malformed vrf public key"))
    }
}

/// Amount of the balance in the transaction.
#[wasm_bindgen]
pub struct Balance(tx::Balance);

impl From<tx::Balance> for Balance {
    fn from(balance: tx::Balance) -> Balance {
        Balance(balance)
    }
}

#[wasm_bindgen]
impl Balance {
    //Not sure is this is the best way
    pub fn get_sign(&self) -> JsValue {
        JsValue::from_str(match self.0 {
            tx::Balance::Positive(_) => "positive",
            tx::Balance::Negative(_) => "negative",
            tx::Balance::Zero => "zero",
        })
    }

    pub fn is_positive(&self) -> bool {
        match self.0 {
            tx::Balance::Positive(_) => true,
            _ => false,
        }
    }

    pub fn is_negative(&self) -> bool {
        match self.0 {
            tx::Balance::Negative(_) => true,
            _ => false,
        }
    }

    pub fn is_zero(&self) -> bool {
        match self.0 {
            tx::Balance::Zero => true,
            _ => false,
        }
    }

    /// Get value without taking into account if the balance is positive or negative
    pub fn get_value(&self) -> Value {
        match self.0 {
            tx::Balance::Positive(v) => Value(v),
            tx::Balance::Negative(v) => Value(v),
            tx::Balance::Zero => Value(value::Value(0)),
        }
    }
}

/// Algorithm used to compute transaction fees
/// Currently the only implementation is the Linear one
#[wasm_bindgen]
pub struct Fee(FeeVariant);

#[wasm_bindgen]
impl Fee {
    /// Linear algorithm, this is formed by: `coefficient * (#inputs + #outputs) + constant + certificate * #certificate
    pub fn linear_fee(constant: Value, coefficient: Value, certificate: Value) -> Fee {
        Fee(FeeVariant::Linear(fee::LinearFee::new(
            *constant.0.as_ref(),
            *coefficient.0.as_ref(),
            *certificate.0.as_ref(),
        )))
    }

    pub fn calculate(&self, tx: Transaction) -> Value {
        let fee_algorithm = match &self.0 {
            FeeVariant::Linear(algorithm) => algorithm,
        };

        use fee::FeeAlgorithm;
        let v = map_payloads!(tx.0, tx, {
            fee_algorithm.calculate(
                tx.as_slice().payload().to_certificate_slice(),
                tx.nb_inputs(),
                tx.nb_outputs(),
            )
        });
        Value(v)
    }
}

pub enum FeeVariant {
    Linear(fee::LinearFee),
}

/// Structure that proofs that certain user agrees with
/// some data. This structure is used to sign `Transaction`
/// and get `SignedTransaction` out.
///
/// It's important that witness works with opaque structures
/// and may not know the contents of the internal transaction.
#[wasm_bindgen]
#[derive(Clone)]
pub struct Witness(tx::Witness);

impl From<tx::Witness> for Witness {
    fn from(witness: tx::Witness) -> Witness {
        Witness(witness)
    }
}

#[wasm_bindgen]
impl Witness {
    /// Generate Witness for an utxo-based transaction Input
    pub fn for_utxo(
        genesis_hash: Hash,
        transaction_id: TransactionSignDataHash,
        secret_key: PrivateKey,
    ) -> Witness {
        Witness(tx::Witness::new_utxo(
            &genesis_hash.0,
            &transaction_id.0,
            &secret_key.0,
        ))
    }

    /// Generate Witness for an account based transaction Input
    /// the account-spending-counter should be incremented on each transaction from this account
    pub fn for_account(
        genesis_hash: Hash,
        transaction_id: TransactionSignDataHash,
        secret_key: PrivateKey,
        account_spending_counter: SpendingCounter,
    ) -> Witness {
        Witness(tx::Witness::new_account(
            &genesis_hash.0,
            &transaction_id.0,
            &account_spending_counter.0,
            &secret_key.0,
        ))
    }

    /// Get string representation
    pub fn to_bech32(&self) -> Result<String, JsValue> {
        let bytes = self
            .0
            .serialize_as_vec()
            .map_err(|error| JsValue::from_str(&format!("{}", error)))?;

        Bech32::new("witness".to_string(), bytes.to_base32())
            .map(|bech32| bech32.to_string())
            .map_err(|error| JsValue::from_str(&format!("{}", error)))
    }
}

impl_collection!(Witnesses, Witness);

#[wasm_bindgen]
pub struct SpendingCounter(account::SpendingCounter);

impl From<account::SpendingCounter> for SpendingCounter {
    fn from(spending_counter: account::SpendingCounter) -> SpendingCounter {
        SpendingCounter(spending_counter)
    }
}

/// Spending counter associated to an account.
///
/// every time the owner is spending from an account,
/// the counter is incremented. A matching counter
/// needs to be used in the spending phase to make
/// sure we have non-replayability of a transaction.
#[wasm_bindgen]
impl SpendingCounter {
    pub fn zero() -> Self {
        account::SpendingCounter::zero().into()
    }

    pub fn from_u32(counter: u32) -> Self {
        account::SpendingCounter::from(counter).into()
    }
}

/// All possible messages recordable in the Block content
#[wasm_bindgen]
#[derive(Clone)]
pub struct Fragment(chain::fragment::Fragment);

impl From<chain::fragment::Fragment> for Fragment {
    fn from(msg: chain::fragment::Fragment) -> Fragment {
        Fragment(msg)
    }
}

#[wasm_bindgen]
impl Fragment {
    pub fn from_transaction(tx: Transaction) -> Fragment {
        use chain::fragment::Fragment as F;
        use TaggedTransaction as T;
        match tx.0 {
            T::NoExtra(auth_tx) => F::Transaction(auth_tx),
            T::PoolRegistration(auth_tx) => F::PoolRegistration(auth_tx),
            T::PoolRetirement(auth_tx) => F::PoolRetirement(auth_tx),
            T::PoolUpdate(auth_tx) => F::PoolUpdate(auth_tx),
            T::StakeDelegation(auth_tx) => F::StakeDelegation(auth_tx),
            T::OwnerStakeDelegation(auth_tx) => F::OwnerStakeDelegation(auth_tx),
        }
        .into()
    }

    /// Get a Transaction if the Fragment represents one
    pub fn get_transaction(self) -> Result<Transaction, JsValue> {
        use chain::fragment::Fragment as F;
        use TaggedTransaction as T;
        match self.0 {
            F::Transaction(auth) => Ok(T::NoExtra(auth)),
            F::OwnerStakeDelegation(auth) => Ok(T::OwnerStakeDelegation(auth)),
            F::StakeDelegation(auth) => Ok(T::StakeDelegation(auth)),
            F::PoolRegistration(auth) => Ok(T::PoolRegistration(auth)),
            F::PoolRetirement(auth) => Ok(T::PoolRetirement(auth)),
            F::PoolUpdate(auth) => Ok(T::PoolUpdate(auth)),
            _ => Err(JsValue::from_str("Invalid fragment type")),
        }
        .map(Transaction)
    }

    pub fn as_bytes(&self) -> Result<Vec<u8>, JsValue> {
        self.0
            .serialize_as_vec()
            .map_err(|error| JsValue::from_str(&format!("{}", error)))
    }

    pub fn is_initial(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::Initial(_) => true,
            _ => false,
        }
    }

    pub fn is_transaction(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::Transaction(_) => true,
            _ => false,
        }
    }

    pub fn is_owner_stake_delegation(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::OwnerStakeDelegation(_) => true,
            _ => false,
        }
    }

    pub fn is_stake_delegation(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::StakeDelegation(_) => true,
            _ => false,
        }
    }

    pub fn is_pool_registration(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::PoolRegistration(_) => true,
            _ => false,
        }
    }

    pub fn is_pool_retirement(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::PoolRetirement(_) => true,
            _ => false,
        }
    }

    pub fn is_pool_update(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::PoolUpdate(_) => true,
            _ => false,
        }
    }

    pub fn is_old_utxo_declaration(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::OldUtxoDeclaration(_) => true,
            _ => false,
        }
    }

    pub fn is_update_proposal(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::UpdateProposal(_) => true,
            _ => false,
        }
    }

    pub fn is_update_vote(&self) -> bool {
        match self.0 {
            chain::fragment::Fragment::UpdateVote(_) => true,
            _ => false,
        }
    }

    pub fn id(&self) -> FragmentId {
        self.0.id().into()
    }
}

/// `Block` is an element of the blockchain it contains multiple
/// transaction and a reference to the parent block. Alongside
/// with the position of that block in the chain.
#[wasm_bindgen]
pub struct Block(chain::block::Block);

impl From<chain::block::Block> for Block {
    fn from(block: chain::block::Block) -> Block {
        Block(block)
    }
}

#[wasm_bindgen]
impl Block {
    /// Deserialize a block from a byte array
    pub fn from_bytes(bytes: Uint8Array) -> Result<Block, JsValue> {
        let mut slice: Box<[u8]> = vec![0; bytes.length() as usize].into_boxed_slice();
        bytes.copy_to(&mut *slice);
        chain::block::Block::deserialize(&*slice)
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
            .map(Block)
    }

    pub fn id(&self) -> BlockId {
        self.0.id().into()
    }

    pub fn parent_id(&self) -> BlockId {
        self.0.parent_id().into()
    }

    ///This involves copying all the fragments
    pub fn fragments(&self) -> Fragments {
        self.0
            .fragments()
            .map(|m| Fragment::from(m.clone()))
            .collect::<Vec<Fragment>>()
            .into()
    }

    pub fn epoch(&self) -> u32 {
        self.0.date().epoch
    }

    pub fn slot(&self) -> u32 {
        self.0.date().slot_id
    }

    pub fn chain_length(&self) -> u32 {
        u32::from(self.0.chain_length())
    }

    pub fn leader_id(&self) -> Option<PoolId> {
        Some(self.0.header.get_stakepool_id()?.into())
    }

    pub fn content_size(&self) -> u32 {
        self.0.header.block_content_size()
    }
}

#[wasm_bindgen]
pub struct BlockId(key::Hash);

impl From<key::Hash> for BlockId {
    fn from(block_id: key::Hash) -> BlockId {
        BlockId(block_id)
    }
}

#[wasm_bindgen]
impl BlockId {
    pub fn as_bytes(&self) -> Vec<u8> {
        self.0.serialize_as_vec().unwrap()
    }
}

#[wasm_bindgen]
pub struct FragmentId(chain::fragment::FragmentId);

impl From<chain::fragment::FragmentId> for FragmentId {
    fn from(fragment_id: chain::fragment::FragmentId) -> FragmentId {
        FragmentId(fragment_id)
    }
}

#[wasm_bindgen]
impl FragmentId {
    pub fn from_bytes(bytes: &[u8]) -> FragmentId {
        chain::fragment::FragmentId::hash_bytes(bytes).into()
    }

    pub fn as_bytes(&self) -> Vec<u8> {
        self.0.serialize_as_vec().unwrap()
    }
}

//this is useful for debugging, I'm not sure it is a good idea to have it here

#[wasm_bindgen]
pub fn uint8array_to_hex(input: JsValue) -> Result<String, JsValue> {
    //For some reason JSON.stringify serializes Uint8Array as objects instead of arrays
    let input_array: std::collections::BTreeMap<usize, u8> = input
        .into_serde()
        .map_err(|e| JsValue::from_str(&format!("{}", e)))?;

    let mut s = String::with_capacity(input_array.len() * 2);

    for &byte in input_array.values() {
        s.push_str(&hex::encode([byte]));
    }

    Ok(s)
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
