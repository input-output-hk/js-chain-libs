use crate::{
    certificate, tx, Address, Balance, Certificate, Fee, FeeVariant, Input, Inputs, OutputPolicy,
    Outputs, Value,
};
use wasm_bindgen::prelude::*;

// Map payloads regardless of which type in a static way.
// This is needed because Payload can't be made into a Trait object, so
// it is not possible to use an FnOnce that takes any Payload
macro_rules! map_payload {
    ($payload:expr, |$with:ident| $body:expr) => {
        match $payload {
            TaggedPayload::NoPayload => {
                let $with = tx::NoExtra;
                $body
            }
            TaggedPayload::Certificate(cert) => {
                use certificate::Certificate as C;
                match cert {
                    C::OwnerStakeDelegation($with) => $body,
                    C::StakeDelegation($with) => $body,
                    C::PoolRegistration($with) => $body,
                    C::PoolUpdate($with) => $body,
                    C::PoolRetirement($with) => $body,
                    C::VotePlan($with) => $body,
                    C::VoteCast($with) => $body,
                    C::VoteTally($with) => $body,
                }
            }
        }
    };
}

#[wasm_bindgen]
pub struct Payload(TaggedPayload);

enum TaggedPayload {
    NoPayload,
    Certificate(certificate::Certificate),
}

#[wasm_bindgen]
impl Payload {
    pub fn no_payload() -> Self {
        Self(TaggedPayload::NoPayload)
    }

    pub fn certificate(certificate: &Certificate) -> Self {
        Self(TaggedPayload::Certificate(certificate.0.clone()))
    }
}

#[wasm_bindgen]
pub struct InputOutputBuilder(tx::InputOutputBuilder);

#[wasm_bindgen]
impl InputOutputBuilder {
    // TODO: Add constructor attribute
    #[wasm_bindgen]
    pub fn empty() -> InputOutputBuilder {
        InputOutputBuilder(tx::InputOutputBuilder::empty())
    }

    /// Add input to the IO Builder
    #[wasm_bindgen]
    pub fn add_input(&mut self, input: &Input) -> Result<(), JsValue> {
        self.0
            .add_input(&input.0)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
    }

    /// Add output to the IO Builder
    #[wasm_bindgen]
    pub fn add_output(&mut self, address: Address, value: Value) -> Result<(), JsValue> {
        self.0
            .add_output(address.0, value.0)
            .map_err(|e| JsValue::from_str(&format! {"{:?}", e}))
    }

    /// Estimate fee with the currently added inputs, outputs and certificate based on the given algorithm
    #[wasm_bindgen]
    pub fn estimate_fee(&self, fee: &Fee, payload: &Payload) -> Value {
        let fee_algorithm = match fee.0 {
            FeeVariant::Linear(fee_algorithm) => fee_algorithm,
        };
        use tx::Payload as _;
        map_payload!(&payload.0, |payload| Value(
            self.0
                .estimate_fee(payload.payload_data().borrow(), &fee_algorithm)
        ))
    }

    #[wasm_bindgen]
    pub fn get_balance(&self, payload: &Payload, fee: &Fee) -> Result<Balance, JsValue> {
        let fee_algorithm = match fee.0 {
            FeeVariant::Linear(fee_algorithm) => fee_algorithm,
        };
        use tx::Payload as _;
        let balance = map_payload!(&payload.0, |payload| self
            .0
            .get_balance(payload.payload_data().borrow(), &fee_algorithm));

        balance
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
            .map(|balance| balance.into())
    }

    #[wasm_bindgen]
    pub fn get_balance_without_fee(&self) -> Result<Balance, JsValue> {
        self.0
            .get_balance_without_fee()
            .map(|balance| balance.into())
            .map_err(|e| JsValue::from_str(&format!("{}", e)))
    }

    #[wasm_bindgen]
    pub fn build(self) -> InputOutput {
        InputOutput(self.0.build())
    }
    /// Seal the transaction by passing fee rule
    #[wasm_bindgen]
    pub fn seal(self, payload: &Payload, fee_algorithm: Fee) -> Result<InputOutput, JsValue> {
        use tx::Payload as _;
        let fee_algorithm = match fee_algorithm.0 {
            FeeVariant::Linear(algo) => algo,
        };

        map_payload!(&payload.0, |payload| self
            .0
            .seal(payload.payload_data().borrow(), &fee_algorithm))
        .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
        .map(InputOutput)
    }

    /// Seal the transaction by passing fee rule and the output policy
    //
    // Along with the transaction, this return the balance unassigned to output policy
    // if any
    //
    // TODO: Add Balance and unassigned inputs, this is, the real signature of
    // <(Balance, Vec<Output<Address>>, InputOutput)
    pub fn seal_with_output_policy(
        self,
        payload: &Payload,
        fee_algorithm: Fee,
        policy: OutputPolicy,
    ) -> Result<InputOutput, JsValue> {
        use tx::Payload as _;

        let fee_algorithm = match fee_algorithm.0 {
            FeeVariant::Linear(algo) => algo,
        };
        map_payload!(&payload.0, |payload| self.0.seal_with_output_policy(
            payload.payload_data().borrow(),
            &fee_algorithm,
            policy.0,
        ))
        .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
        .map(|(_balance, _unassigned, io)| InputOutput(io))
    }
}

#[wasm_bindgen]
pub struct InputOutput(tx::InputOutput);

#[wasm_bindgen]
impl InputOutput {
    pub fn inputs(&self) -> Inputs {
        let v: Vec<_> = self.0.inputs.iter().map(|i| (*i).clone().into()).collect();
        Inputs(v)
    }

    pub fn outputs(&self) -> Outputs {
        let v: Vec<_> = self.0.outputs.iter().map(|i| (*i).clone().into()).collect();
        Outputs(v)
    }
}
