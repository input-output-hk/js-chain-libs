// @flow
import { stub } from 'sinon';
import { flatten } from 'lodash';
import config from 'config';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import type { NodeSettings } from '../../app/reducers/types';
import SendTransaction from '../../app/components/SendTransaction';

Enzyme.configure({ adapter: new Adapter() });
const defaultNodeSettings = {
  block0Hash: 'notimportant',
  fees: { constant: 10, certificate: 10, coefficient: 10 }
};
const mockedAddress = 'notimportant';
const getAddressInput = form =>
  form.find(Form.Control).find({ name: 'recipient' });
const getAmountInput = form => form.find(Form.Control).find({ name: 'amount' });
const getAmountNegativeFeedback = form =>
  form
    .find(Form.Control.Feedback)
    .find({ type: 'invalid' })
    .at(1);
const getAmountPositiveFeedback = form =>
  form.find(Form.Control.Feedback).find({ type: 'valid' });
const getSubmitButton = form => form.find(Button);

function setup(balance: number, nodeSettings: NodeSettings) {
  const sendTransaction = stub();
  const isValidAddress = stub();
  // by default, the address'll be considered valid
  isValidAddress.resolves(true);
  const component = shallow(
    <SendTransaction
      {...{ balance, isValidAddress, nodeSettings, sendTransaction }}
    />
  );
  return {
    component,
    sendTransaction,
    isValidAddress
  };
}

describe('SendTransaction component', () => {
  test('should match exact snapshot', () => {
    const form = (
      <SendTransaction
        balance={0}
        nodeSettings={defaultNodeSettings}
        sendTransaction={stub()}
        isValidAddress={stub()}
      />
    );
    const tree = renderer.create(form).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('Form validations', () => {
    describe('button validations', () => {
      const VALID = 'valid';
      const INVALID = 'invalid';
      const EMPTY = 'empty';
      type InputStatus = typeof VALID | typeof INVALID | typeof EMPTY;
      describe.each(
        flatten(
          [EMPTY, VALID, INVALID].map((first, index, array) =>
            array.map(second => [first, second])
          )
        ).map(([amount, address]) => [
          `button is ${
            amount === VALID && address === VALID ? '' : 'NOT'
          } enabled when amount is ${amount} and recipient is ${address}`,
          {
            amount,
            address,
            buttonDisabled: !(amount === VALID && address === VALID)
          }
        ])
      )(
        '%s',
        (
          title,
          {
            amount,
            address,
            buttonDisabled
          }: {
            amount: InputStatus,
            address: InputStatus,
            buttonDisabled: boolean
          }
        ) => {
          describe(`GIVEN a ${address} address`, () => {
            let component;
            let isValidAddress;
            beforeAll(async () => {
              ({ component, isValidAddress } = setup(100, defaultNodeSettings));
              if (address !== EMPTY) {
                isValidAddress.resolves(address === VALID);
                getAddressInput(component).simulate('change', {
                  target: { value: mockedAddress }
                });
                // validator is debounced, we have to wait for it.
                await new Promise(resolve =>
                  setTimeout(resolve, config.get('formDebounceInterval'))
                );
              }
            });
            describe(`AND GIVEN a ${amount} amount`, () => {
              beforeAll(() => {
                if (amount !== EMPTY) {
                  getAmountInput(component).simulate('change', {
                    target: { value: amount === VALID ? '20' : '200' }
                  });
                }
              });
              test(`THEN the submit button is ${
                buttonDisabled ? 'disabled' : 'enabled'
              }`, () => {
                expect(getSubmitButton(component).prop('disabled')).toBe(
                  buttonDisabled
                );
              });
            });
          });
        }
      );
    });

    describe('amount validations', () => {
      describe.each([
        [
          'an empty form has no errors but is not valid',
          {
            initialState: 'GIVEN no amount is entered',
            balance: 100,
            amount: null,
            isValid: false,
            isInvalid: false
          }
        ],
        [
          'amount must be lower than balance',
          {
            initialState: 'GIVEN an amount > balance is entered',
            balance: 100,
            amount: 101,
            isValid: false,
            isInvalid: true,
            negativeFeedback: 'Insufficient balance. Max: 70'
          }
        ],
        [
          'amount must be lower than (balance - transactionFees)',
          {
            initialState:
              'GIVEN an amount > (balance - transactionFees) is entered',
            balance: 100,
            amount: 71,
            isValid: false,
            isInvalid: true,
            negativeFeedback: 'Insufficient balance. Max: 70'
          }
        ],
        [
          'amount can be equal to (balance - transactionFees)',
          {
            initialState:
              'GIVEN an amount == (balance - transactionFees) is entered',
            balance: 100,
            amount: 70,
            isValid: true,
            isInvalid: false,
            negativeFeedback: null,
            positiveFeedback: 'After fee: 100'
          }
        ],
        // context: a negative max amount was being displayed
        [
          'when the balance is lower than transaction fees, a separate message is shown',
          {
            initialState:
              'GIVEN a user with less balance than the transaction fees AND a minimal amount is enteredbalance: ',
            balance: 20,
            amount: 1,
            isValid: false,
            isInvalid: true,
            negativeFeedback:
              'Your balance is lower than the transaction fees :('
          }
        ],
        [
          'negative amounts arent valid',
          {
            initialState: 'GIVEN a negative amount',
            balance: 100,
            amount: -1,
            isValid: false,
            isInvalid: true,
            negativeFeedback: 'Balance must be positive'
          }
        ]
      ])(
        '%s',
        (
          description,
          {
            initialState,
            balance,
            amount,
            isValid,
            isInvalid,
            negativeFeedback,
            positiveFeedback
          }
        ) => {
          let component;
          beforeAll(() => {
            ({ component } = setup(balance, defaultNodeSettings));
          });

          describe(initialState, () => {
            beforeAll(() => {
              if (typeof amount === 'number') {
                getAmountInput(component).simulate('change', {
                  target: { value: amount.toString() }
                });
              }
            });
            if (typeof amount === 'number') {
              test('THEN the value changed', () => {
                expect(getAmountInput(component).prop('value')).toBe(amount);
              });
            }
            test(`AND the amount ${isValid ? 'IS' : 'is NOT'} valid`, () => {
              expect(getAmountInput(component).prop('isValid')).toBe(isValid);
            });
            test(`AND the amount ${
              isInvalid ? 'IS' : 'is NOT'
            } invalid`, () => {
              expect(getAmountInput(component).prop('isInvalid')).toBe(
                isInvalid
              );
            });
            if (isValid) {
              test('AND a message showing the amount to send is displayed', () => {
                expect(
                  getAmountPositiveFeedback(component).prop('children')
                ).toMatch(positiveFeedback);
              });
            }
            if (isInvalid) {
              test('AND an error message is displayed', () => {
                expect(
                  getAmountNegativeFeedback(component).prop('children')
                ).toMatch(negativeFeedback);
              });
            }
          });
        }
      );
    });
  });
});
