use crate::*;
use wasm_bindgen::prelude::*;

macro_rules! transition_from_to {
    ($builder: expr, $from:ident -> $to:ident, |$with:ident| $body:expr) => {
        match $builder {
            $from::NoExtra($with) => $to::NoExtra($body),
            $from::OwnerStakeDelegation($with) => $to::OwnerStakeDelegation($body),
            $from::StakeDelegation($with) => $to::StakeDelegation($body),
            $from::PoolRegistration($with) => $to::PoolRegistration($body),
            $from::PoolUpdate($with) => $to::PoolUpdate($body),
            $from::PoolRetirement($with) => $to::PoolRetirement($body),
        }
    };
}

macro_rules! for_all_payloads {
    ($from:ident, $builder:expr, |$with:ident| $body:expr) => {
        match $builder {
            $from::NoExtra($with) => $body,
            $from::OwnerStakeDelegation($with) => $body,
            $from::StakeDelegation($with) => $body,
            $from::PoolRegistration($with) => $body,
            $from::PoolUpdate($with) => $body,
            $from::PoolRetirement($with) => $body,
        }
    };
}

//--------TransactionBuilder---------//
//-----------------------------------//

/// Builder pattern implementation for making a Transaction
///
/// Example
///
/// ```javascript
/// ```
#[wasm_bindgen]
pub struct TransactionBuilder(tx::TxBuilder);

#[wasm_bindgen]
pub struct TransactionBuilderSetIOs(TaggedTransactionBuilderSetIOs);

enum TaggedTransactionBuilderSetIOs {
    NoExtra(tx::TxBuilderState<tx::SetIOs<tx::NoExtra>>),
    StakeDelegation(tx::TxBuilderState<tx::SetIOs<certificate::StakeDelegation>>),
    OwnerStakeDelegation(tx::TxBuilderState<tx::SetIOs<certificate::OwnerStakeDelegation>>),
    PoolRegistration(tx::TxBuilderState<tx::SetIOs<certificate::PoolRegistration>>),
    PoolRetirement(tx::TxBuilderState<tx::SetIOs<certificate::PoolRetirement>>),
    PoolUpdate(tx::TxBuilderState<tx::SetIOs<certificate::PoolUpdate>>),
}

#[wasm_bindgen]
pub struct TransactionBuilderSetWitness(TaggedTransactionBuilderSetWitness);

enum TaggedTransactionBuilderSetWitness {
    NoExtra(tx::TxBuilderState<tx::SetWitnesses<tx::NoExtra>>),
    StakeDelegation(tx::TxBuilderState<tx::SetWitnesses<certificate::StakeDelegation>>),
    OwnerStakeDelegation(tx::TxBuilderState<tx::SetWitnesses<certificate::OwnerStakeDelegation>>),
    PoolRegistration(tx::TxBuilderState<tx::SetWitnesses<certificate::PoolRegistration>>),
    PoolRetirement(tx::TxBuilderState<tx::SetWitnesses<certificate::PoolRetirement>>),
    PoolUpdate(tx::TxBuilderState<tx::SetWitnesses<certificate::PoolUpdate>>),
}

#[wasm_bindgen]
pub struct TransactionBuilderSetAuthData(TaggedTransactionBuilderSetAuthData);

enum TaggedTransactionBuilderSetAuthData {
    NoExtra(tx::TxBuilderState<tx::SetAuthData<tx::NoExtra>>),
    StakeDelegation(tx::TxBuilderState<tx::SetAuthData<certificate::StakeDelegation>>),
    OwnerStakeDelegation(tx::TxBuilderState<tx::SetAuthData<certificate::OwnerStakeDelegation>>),
    PoolRegistration(tx::TxBuilderState<tx::SetAuthData<certificate::PoolRegistration>>),
    PoolRetirement(tx::TxBuilderState<tx::SetAuthData<certificate::PoolRetirement>>),
    PoolUpdate(tx::TxBuilderState<tx::SetAuthData<certificate::PoolUpdate>>),
}

#[wasm_bindgen]
impl TransactionBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        TransactionBuilder(tx::TxBuilder::new())
    }

    pub fn payload(self, cert: &Certificate) -> TransactionBuilderSetIOs {
        TransactionBuilderSetIOs(match &cert.0 {
            certificate::Certificate::PoolRegistration(p) => {
                TaggedTransactionBuilderSetIOs::PoolRegistration(self.0.set_payload(&p))
            }
            certificate::Certificate::PoolRetirement(p) => {
                TaggedTransactionBuilderSetIOs::PoolRetirement(self.0.set_payload(&p))
            }
            certificate::Certificate::PoolUpdate(p) => {
                TaggedTransactionBuilderSetIOs::PoolUpdate(self.0.set_payload(&p))
            }
            certificate::Certificate::StakeDelegation(p) => {
                TaggedTransactionBuilderSetIOs::StakeDelegation(self.0.set_payload(&p))
            }
            certificate::Certificate::OwnerStakeDelegation(p) => {
                TaggedTransactionBuilderSetIOs::OwnerStakeDelegation(self.0.set_payload(&p))
            }
        })
    }

    pub fn no_payload(self) -> TransactionBuilderSetIOs {
        TransactionBuilderSetIOs(TaggedTransactionBuilderSetIOs::NoExtra(
            self.0.set_nopayload(),
        ))
    }
}

#[wasm_bindgen]
impl TransactionBuilderSetIOs {
    pub fn set_ios(self, inputs: &Inputs, outputs: &Outputs) -> TransactionBuilderSetWitness {
        let inputs: Vec<_> = inputs.0.iter().map(|i| i.0.clone()).collect();
        let outputs: Vec<_> = outputs.0.iter().map(|i| i.0.clone()).collect();

        let tagged = transition_from_to!(
            self.0,
            TaggedTransactionBuilderSetIOs ->
            TaggedTransactionBuilderSetWitness,
            |builder| builder.set_ios(&inputs[..], &outputs[..])
        );
        TransactionBuilderSetWitness(tagged)
    }
}

/// Example (for an account as input)
///
/// ```javascript
/// ```

#[wasm_bindgen]
impl TransactionBuilderSetWitness {
    pub fn get_auth_data_for_witness(&self) -> TransactionSignDataHash {
        let hash = for_all_payloads!(TaggedTransactionBuilderSetWitness, &self.0, |builder| {
            builder.get_auth_data_for_witness().hash()
        });

        TransactionSignDataHash(hash)
    }

    pub fn set_witnesses(self, witnesses: &Witnesses) -> TransactionBuilderSetAuthData {
        let witnesses: Vec<_> = witnesses.0.iter().map(|w| w.0.clone()).collect();

        let tagged = transition_from_to!(
            self.0,
            TaggedTransactionBuilderSetWitness ->
            TaggedTransactionBuilderSetAuthData,
            |builder| builder.set_witnesses(&witnesses[..])
        );

        TransactionBuilderSetAuthData(tagged)
    }
}

#[wasm_bindgen]
impl TransactionBuilderSetAuthData {
    pub fn get_auth_data(&self) -> TransactionBindingAuthData {
        for_all_payloads!(TaggedTransactionBuilderSetAuthData, &self.0, |builder| {
            TransactionBindingAuthData(builder.get_auth_data().0.clone().to_owned())
        })
    }

    /// Set the authenticated data
    pub fn set_payload_auth(self, auth: PayloadAuthData) -> Result<Transaction, JsValue> {
        use super::TaggedTransaction as T;
        use TaggedPayloadAuthData as P;

        let tx = match auth.0 {
            P::NoPayload(a) => match self.0 {
                TaggedTransactionBuilderSetAuthData::NoExtra(builder) => {
                    T::NoExtra(builder.set_payload_auth(&a))
                }
                _ => return Err(JsValue::from_str(&"Invalid auth type".to_owned())),
            },
            P::StakeDelegation(a) => match self.0 {
                TaggedTransactionBuilderSetAuthData::StakeDelegation(builder) => {
                    T::StakeDelegation(builder.set_payload_auth(&a))
                }
                _ => return Err(JsValue::from_str(&"Invalid auth type".to_owned())),
            },
            P::OwnerStakeDelegation(a) => match self.0 {
                TaggedTransactionBuilderSetAuthData::OwnerStakeDelegation(builder) => {
                    T::OwnerStakeDelegation(builder.set_payload_auth(&a))
                }
                _ => return Err(JsValue::from_str(&"Invalid auth type".to_owned())),
            },
            P::PoolRegistration(a) => match self.0 {
                TaggedTransactionBuilderSetAuthData::PoolRegistration(builder) => {
                    T::PoolRegistration(builder.set_payload_auth(&a))
                }
                _ => return Err(JsValue::from_str(&"Invalid auth type".to_owned())),
            },
            P::PoolRetirement(a) => match self.0 {
                TaggedTransactionBuilderSetAuthData::PoolRetirement(builder) => {
                    T::PoolRetirement(builder.set_payload_auth(&a))
                }
                _ => return Err(JsValue::from_str(&"Invalid auth type".to_owned())),
            },
            P::PoolUpdate(a) => match self.0 {
                TaggedTransactionBuilderSetAuthData::PoolUpdate(builder) => {
                    T::PoolUpdate(builder.set_payload_auth(&a))
                }
                _ => return Err(JsValue::from_str(&"Invalid auth type".to_owned())),
            },
        };
        Ok(Transaction(tx))
    }
}

#[wasm_bindgen]
pub struct TransactionBindingAuthData(Vec<u8>);

#[wasm_bindgen]
pub struct PayloadAuthData(TaggedPayloadAuthData);

pub enum TaggedPayloadAuthData {
    NoPayload(<tx::NoExtra as tx::Payload>::Auth),
    OwnerStakeDelegation(<certificate::OwnerStakeDelegation as tx::Payload>::Auth),
    StakeDelegation(<certificate::StakeDelegation as tx::Payload>::Auth),
    PoolRegistration(<certificate::PoolRegistration as tx::Payload>::Auth),
    PoolRetirement(<certificate::PoolRetirement as tx::Payload>::Auth),
    PoolUpdate(<certificate::PoolUpdate as tx::Payload>::Auth),
}

#[wasm_bindgen]
impl PayloadAuthData {
    pub fn for_no_payload() -> PayloadAuthData {
        Self(TaggedPayloadAuthData::NoPayload(()))
    }

    pub fn for_owner_stake_delegation() -> PayloadAuthData {
        Self(TaggedPayloadAuthData::OwnerStakeDelegation(()))
    }

    pub fn for_stake_delegation(auth_data: StakeDelegationAuthData) -> PayloadAuthData {
        Self(TaggedPayloadAuthData::StakeDelegation(auth_data.0))
    }

    pub fn for_pool_registration(auth_data: PoolRegistrationAuthData) -> PayloadAuthData {
        Self(TaggedPayloadAuthData::PoolRegistration(auth_data.0))
    }

    pub fn for_pool_retirement(auth_data: PoolRetirementAuthData) -> PayloadAuthData {
        Self(TaggedPayloadAuthData::PoolRegistration(auth_data.0))
    }

    pub fn for_pool_update(auth_data: PoolUpdateAuthData) -> PayloadAuthData {
        Self(TaggedPayloadAuthData::PoolUpdate(auth_data.0))
    }
}

#[wasm_bindgen]
pub struct StakeDelegationAuthData(<certificate::StakeDelegation as tx::Payload>::Auth);

#[wasm_bindgen]
impl StakeDelegationAuthData {
    pub fn new(signature: AccountBindingSignature) -> StakeDelegationAuthData {
        StakeDelegationAuthData(signature.0)
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct IndexedSignature {
    index: u16,
    signature: AccountBindingSignature,
}

crate::impl_collection!(IndexSignatures, IndexedSignature);

#[wasm_bindgen]
impl IndexedSignature {
    pub fn new(index: u16, signature: AccountBindingSignature) -> IndexedSignature {
        Self { index, signature }
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct AccountBindingSignature(tx::AccountBindingSignature);

#[wasm_bindgen]
impl AccountBindingSignature {
    pub fn new(private_key: &PrivateKey, auth_data: &TransactionBindingAuthData) -> Self {
        Self(tx::AccountBindingSignature::new(
            &private_key.0,
            &tx::TransactionBindingAuthData(auth_data.0.as_slice()),
        ))
    }
}

#[wasm_bindgen]
pub struct PoolRegistrationAuthData(<certificate::PoolRegistration as tx::Payload>::Auth);

#[wasm_bindgen]
impl PoolRegistrationAuthData {
    pub fn new(signatures: IndexSignatures) -> Self {
        let signatures = signatures
            .0
            .iter()
            .map(|IndexedSignature { index, signature }| (*index, signature.0.clone()))
            .collect();
        Self(certificate::PoolOwnersSigned { signatures })
    }
}

#[wasm_bindgen]
pub struct PoolRetirementAuthData(<certificate::PoolRetirement as tx::Payload>::Auth);

#[wasm_bindgen]
impl PoolRetirementAuthData {
    pub fn new(signatures: IndexSignatures) -> Self {
        let signatures = signatures
            .0
            .iter()
            .map(|IndexedSignature { index, signature }| (*index, signature.0.clone()))
            .collect();
        Self(certificate::PoolOwnersSigned { signatures })
    }
}

#[wasm_bindgen]
pub struct PoolUpdateAuthData(<certificate::PoolUpdate as tx::Payload>::Auth);

#[wasm_bindgen]
impl PoolUpdateAuthData {
    pub fn new(signatures: IndexSignatures) -> Self {
        let signatures = signatures
            .0
            .iter()
            .map(|IndexedSignature { index, signature }| (*index, signature.0.clone()))
            .collect();
        Self(certificate::PoolOwnersSigned { signatures })
    }
}
