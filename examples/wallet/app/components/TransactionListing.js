// @flow
import React from 'react';
import curry from 'lodash/curry';
import ClickableBox from 'clickable-box';
import config from 'config';
// FIXME: this is obviously not portable to a webapp
import { shell } from 'electron';
import ListingTable from './Listing/ListingTable';
import type {
  Transaction,
  Address,
  TransactionInput,
  TransactionOutput
} from '../models';
import styles from './TransactionListing.scss';
import ListingRow from './Listing/ListingRow';
import ListingColumn from './Listing/ListingColumn';

type Props = {
  transactions: Array<Transaction>,
  myAddress: Address
};

export default ({ transactions, myAddress }: Props) => {
  return (
    <ListingTable>
      {transactions.map(curry(transactionToRow)(myAddress))}
    </ListingTable>
  );
};

const sumAmounts = (arr: Array<TransactionInput | TransactionOutput>) =>
  arr.reduce((sum, it) => it.amount + sum, 0);

const transactionToRow = (
  myAddress: Address,
  { id, certificate, inputs, outputs }: Transaction
) => {
  let transactionType;
  const inputSum = sumAmounts(inputs);
  const outputSum = sumAmounts(outputs || []);
  if (certificate) {
    const printableCertificateTypes = {
      STAKE_DELEGATION: 'DELEGATION',
      OWNER_STAKE_DELEGATION: 'OWNER DELEGATION',
      POOL_REGISTRATION: 'POOL CREATION'
    };
    transactionType = printableCertificateTypes[certificate.type];
  } else if (inputs.find(({ address }) => address === myAddress)) {
    transactionType = 'SEND';
  } else if ((outputs || []).find(({ address }) => address === myAddress)) {
    transactionType = 'RECEIVE';
  } else {
    console.error(`transaction with id: ${id} is malformed`);
    return null;
  }
  return (
    <ListingRow itemKey={id} className={styles.row}>
      <ListingColumn className={styles.transactionType} xs={2}>
        {transactionType}
      </ListingColumn>
      <ListingColumn xs={2} className={styles.txHash}>
        <ClickableBox
          onClick={() =>
            shell.openExternal(
              `${config.get('explorer.url')}/${config.get(
                'explorer.transactionPath'
              )}/${id}`
            )
          }
        >
          {id}
        </ClickableBox>
      </ListingColumn>
      {/* TODO show date */}
      <ListingColumn xs={1}>04/20/2020</ListingColumn>
      <ListingColumn className={styles.amount} xs={2}>
        {inputSum > outputSum ? inputSum : outputSum}
      </ListingColumn>
      {/* TODO show confirmations */}
      <ListingColumn className={styles.transactionStatus} xs={2}>
        pending
      </ListingColumn>
      {/* TODO add a dropdown with details (inpt sum, output sum, ) */}
    </ListingRow>
  );
};
