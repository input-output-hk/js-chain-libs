// @flow
import { stub } from 'sinon';
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
const userBalance = 100;
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
    describe('An empty form cant be submitted, but does not show validation errors', () => {
      describe('GIVEN a form in its initial state', () => {
        let component;
        beforeAll(() => {
          ({ component } = setup(0, defaultNodeSettings));
        });

        test('THEN button should start disabled', () => {
          expect(getSubmitButton(component).prop('disabled')).toBeTruthy();
        });

        test('AND address should not be valid or invalid', () => {
          expect(getAddressInput(component).prop('isValid')).toBeFalsy();
          expect(getAddressInput(component).prop('isInvalid')).toBeFalsy();
        });

        test('AND amount should not be valid or invalid', () => {
          expect(getAmountInput(component).prop('isValid')).toBeFalsy();
          expect(getAmountInput(component).prop('isInvalid')).toBeFalsy();
        });
      });
    });

    describe('button is enabled when amount and recipient are valid', () => {
      let component;
      beforeAll(() => {
        ({ component } = setup(userBalance, defaultNodeSettings));
      });

      describe('GIVEN an address is entered', () => {
        beforeAll(async () => {
          getAddressInput(component).simulate('change', {
            target: { value: mockedAddress }
          });
          // validator is debounced, we have to wait for it.
          await new Promise(resolve =>
            setTimeout(resolve, config.get('formDebounceInterval'))
          );
        });
        test('THEN the value changed', () => {
          expect(getAddressInput(component).prop('value')).toBe(mockedAddress);
        });
        test('AND the address is valid', () => {
          expect(getAddressInput(component).prop('isValid')).toBeTruthy();
        });
        test('AND the button not enabled by a valid address and an empty value', () => {
          expect(getSubmitButton(component).prop('disabled')).toBeTruthy();
        });

        describe('AND GIVEN an amount is entered', () => {
          beforeAll(() => {
            getAmountInput(component).simulate('change', {
              target: { value: '20' }
            });
          });
          test('THEN the value changed', () => {
            expect(getAmountInput(component).prop('value')).toBe(20);
          });
          test('AND the amount is valid', () => {
            expect(getAmountInput(component).prop('isValid')).toBeTruthy();
          });
          test('AND the button is enabled', () => {
            expect(getSubmitButton(component).prop('disabled')).toBeFalsy();
          });
        });
      });
    });

    describe('button is not enabled by a valid amount and empty address', () => {
      let component;
      beforeAll(() => {
        ({ component } = setup(userBalance, defaultNodeSettings));
      });

      describe('GIVEN an amount is entered', () => {
        beforeAll(() => {
          getAmountInput(component).simulate('change', {
            target: { value: '20' }
          });
        });
        test('THEN the value changed', () => {
          expect(getAmountInput(component).prop('value')).toBe(20);
        });
        test('AND the amount is valid', () => {
          expect(getAmountInput(component).prop('isValid')).toBeTruthy();
        });
        test('AND the button is not enabled', () => {
          expect(getSubmitButton(component).prop('disabled')).toBeTruthy();
        });
      });
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
