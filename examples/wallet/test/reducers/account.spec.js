// @flow
import { SEND_TRANSACTION } from '../../app/actions/account';
import type { Account } from '../../app/reducers/types';
import reducer from '../../app/reducers/account';

describe('account reducer', () => {
  const counter = 0;
  const privateKey = 'sk';
  const publicKey = 'pk';
  const identifier = 'identifier';
  const address = 'me';
  const initialState: Account = {
    transactions: [],
    address,
    counter,
    balance: 0,
    delegation: {},
    privateKey,
    publicKey,
    identifier
  };
  const id = 'id';
  const destination = 'destination';
  const fee = 10;
  const amount = 50;
  describe('initialization', () => {
    describe('GIVEN the reducer is called for the first time', () => {
      let result: Account;
      beforeAll(() => {
        result = reducer(undefined);
      });
      test('THEN only the transactions are populated with an empty array', () => {
        expect(result).toHaveProperty('transactions', []);
        expect(Object.keys(result)).toHaveLength(1);
      });
    });
  });

  describe('sending a transanction with an empty transaction list', () => {
    describe('GIVEN an inital state with zero transactions', () => {
      let result;
      describe('WHEN sending a new transaction', () => {
        beforeAll(() => {
          result = reducer(initialState, {
            type: SEND_TRANSACTION,
            id,
            fee,
            amount,
            destination,
            newCounter: 1
          });
        });
        test('THEN the transaction is added to the list', () => {
          expect(result.transactions).toHaveLength(1);
        });
        test('AND the counter is updated', () => {
          expect(result.counter).toBe(1);
        });
      });
    });
  });

  describe('sending a transanction with a non-empty transaction list', () => {
    describe('GIVEN an inital state with two confirmed transactions', () => {
      const state: Account = {
        ...initialState,
        transactions: [
          {
            id: 'tx2',
            blockHeight: 2,
            inputs: [],
            outputs: []
          },
          {
            id: 'tx1',
            blockHeight: 1,
            inputs: [],
            outputs: []
          }
        ]
      };
      describe('WHEN sending a new pending transaction', () => {
        let result: Account;
        beforeAll(() => {
          result = reducer(state, {
            type: SEND_TRANSACTION,
            id,
            fee,
            amount,
            destination,
            newCounter: 1
          });
        });
        test('THEN the transaction is added to the list', () => {
          expect(result.transactions).toHaveLength(3);
        });
        test('AND the counter is updated', () => {
          expect(result.counter).toBe(1);
        });
        test('AND transactions are ordered as expected', () => {
          expect(result.transactions[0].id).toBe(id);
          expect(result.transactions[1].id).toBe('tx2');
          expect(result.transactions[2].id).toBe('tx1');
        });
      });
    });
  });
});
