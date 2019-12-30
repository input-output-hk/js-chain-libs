// @flow
import { stub } from 'sinon';
import {
  buildSendFundsAction,
  SEND_TRANSACTION
} from '../../app/actions/account';

describe('account actions', () => {
  describe('sendFundsTransaction', () => {
    const privateKey = 'sk';
    const counter = 2;
    const getState = () => ({
      account: {
        privateKey,
        counter
      },
      nodeSettings: {}
    });
    const id = 'txid';
    const transaction = new Uint8Array([1, 2]);
    const fee = 30;
    const destination = 'destination';
    const amount = 100;
    function resetMockHistory() {
      buildTransactionCorrectly.resetHistory();
      broadcastTransactionCorrectly.resetHistory();
      dispatch.resetHistory();
    }

    const dispatch = stub();
    const buildTransactionCorrectly = stub()
      .onFirstCall()
      .returns(
        Promise.resolve({
          id,
          transaction,
          fee
        })
      );
    const broadcastTransactionCorrectly = stub()
      .onFirstCall()
      .returns(
        Promise.resolve({
          id,
          fee
        })
      );

    describe('WHEN dispatching a sendFunds action', () => {
      beforeAll(async () => {
        resetMockHistory();
        await buildSendFundsAction(
          buildTransactionCorrectly,
          broadcastTransactionCorrectly
        )(destination, amount)(dispatch, getState);
      });

      test('THEN the transaction is built with the desired parameters', async () => {
        buildTransactionCorrectly.firstCall.calledWith(
          destination,
          amount,
          privateKey,
          counter,
          {}
        );
      });

      test('AND the transaction is broadcasted', async () => {
        broadcastTransactionCorrectly.firstCall.calledWith(transaction);
        broadcastTransactionCorrectly.firstCall.calledAfter(
          buildTransactionCorrectly.firstCall
        );
      });

      test('AND an action is dispatched to add the transaction to the state', async () => {
        dispatch.firstCall.calledWith({
          type: SEND_TRANSACTION,
          newCounter: counter + 1,
          id,
          destination,
          amount,
          fee
        });
      });
    });

    describe('WHEN dispatching a sendFunds action with a mocked, failing transaction builder', () => {
      const throwWhenBuildingTransaction = stub().returns(
        Promise.reject(new Error('mock'))
      );
      let promise;
      beforeAll(resetMockHistory);
      beforeAll(async () => {
        promise = buildSendFundsAction(
          throwWhenBuildingTransaction,
          broadcastTransactionCorrectly
        )(destination, amount)(dispatch, getState);
      });

      test('THEN should throw', async () => {
        return expect(promise).rejects;
      });

      test('AND the transaction is attempted to be built with the desired parameters', async () => {
        throwWhenBuildingTransaction.firstCall.calledWith(
          destination,
          amount,
          privateKey,
          counter,
          {}
        );
      });

      test('AND the transaction is NOT broadcasted', async () => {
        expect(broadcastTransactionCorrectly.callCount).toBe(0);
      });

      // TODO: we should notify the user somehow
      test('AND no action is dispatched', () => {
        expect(dispatch.callCount).toBe(0);
      });
    });

    describe('WHEN dispatching a sendFunds action with a mocked, failing transaction broadcaster', () => {
      const throwWhenBroadcastingTransaction = stub().returns(
        Promise.reject(new Error('mock'))
      );

      let promise;
      beforeAll(resetMockHistory);
      beforeAll(async () => {
        promise = buildSendFundsAction(
          buildTransactionCorrectly,
          throwWhenBroadcastingTransaction
        )(destination, amount)(dispatch, getState);
      });

      test('THEN should throw', async () => {
        return expect(promise).rejects;
      });

      test('AND the transaction is built with the desired parameters', async () => {
        expect(
          buildTransactionCorrectly.firstCall.calledWith(
            destination,
            amount,
            privateKey,
            counter,
            {}
          )
        ).toBeTruthy();
      });

      test('AND the transaction is broadcasted', async () => {
        expect(
          throwWhenBroadcastingTransaction.firstCall.calledWith(transaction)
        ).toBeTruthy();
        expect(
          throwWhenBroadcastingTransaction.firstCall.calledAfter(
            buildTransactionCorrectly.firstCall
          )
        ).toBeTruthy();
      });

      // TODO: we should notify the user somehow
      test('AND no action is dispatched', () => {
        expect(dispatch.callCount).toBe(0);
      });
    });
  });
});
