mod iobuilder;
mod txbuilder;
use super::certificate;
use super::tx;
use crate::{Input, Inputs, Output, Outputs,  Witness, Witnesses, TransactionSignDataHash};
pub use iobuilder::*;
pub use txbuilder::*;
use wasm_bindgen::prelude::*;

//-----------------------------------//
//-------- Transaction --------------//
//-----------------------------------//

/// Type representing a unsigned transaction
#[wasm_bindgen]
#[derive(Clone)]
pub struct Transaction(pub(crate) TaggedTransaction);

#[macro_export]
macro_rules! map_payloads {
    ($x:expr, $with:ident, $body:expr) => {
        match $x {
            $crate::transaction::TaggedTransaction::NoExtra($with) => $body,
            $crate::transaction::TaggedTransaction::OwnerStakeDelegation($with) => $body,
            $crate::transaction::TaggedTransaction::StakeDelegation($with) => $body,
            $crate::transaction::TaggedTransaction::PoolRegistration($with) => $body,
            $crate::transaction::TaggedTransaction::PoolUpdate($with) => $body,
            $crate::transaction::TaggedTransaction::PoolRetirement($with) => $body,
        }
    };
}

#[derive(Clone)]
pub enum TaggedTransaction {
    NoExtra(tx::Transaction<tx::NoExtra>),
    StakeDelegation(tx::Transaction<certificate::StakeDelegation>),
    OwnerStakeDelegation(tx::Transaction<certificate::OwnerStakeDelegation>),
    PoolRegistration(tx::Transaction<certificate::PoolRegistration>),
    PoolRetirement(tx::Transaction<certificate::PoolRetirement>),
    PoolUpdate(tx::Transaction<certificate::PoolUpdate>),
}

impl TaggedTransaction {
    fn id(&self) -> TransactionSignDataHash {
        map_payloads!(self, tx, tx.hash().into())
    }

    fn witnesses(&self) -> Witnesses {
        map_payloads!(
            self,
            tx,
            tx.as_slice()
                .witnesses()
                .iter()
                .map(|witness| Witness(witness.clone()))
                .collect::<Vec<Witness>>()
                .into()
        )
    }

    fn inputs(&self) -> Vec<tx::Input> {
        map_payloads!(self, tx, tx.as_slice().inputs().iter().collect())
    }

    fn outputs(&self) -> Vec<tx::Output<chain_addr::Address>> {
        map_payloads!(self, tx, tx.as_slice().outputs().iter().collect())
    }
}

impl From<tx::Transaction<tx::NoExtra>> for Transaction {
    fn from(tx: tx::Transaction<tx::NoExtra>) -> Self {
        Transaction(TaggedTransaction::NoExtra(tx))
    }
}

#[wasm_bindgen]
impl Transaction {
    /// Get the transaction id, needed to compute its signature
    pub fn id(&self) -> TransactionSignDataHash {
        self.0.id()
    }

    /// Get collection of the inputs in the transaction (this allocates new copies of all the values)
    pub fn inputs(&self) -> Inputs {
        self.0
            .inputs()
            .iter()
            .map(|input| Input(input.clone()))
            .collect::<Vec<Input>>()
            .into()
    }

    /// Get collection of the outputs in the transaction (this allocates new copies of all the values)
    pub fn outputs(&self) -> Outputs {
        self.0
            .outputs()
            .iter()
            .map(|output| Output(output.clone()))
            .collect::<Vec<Output>>()
            .into()
    }

    pub fn clone(&self) -> Transaction {
        Transaction(self.0.clone())
    }

    pub fn witnesses(&self) -> Witnesses {
        self.0.witnesses()
    }
}
