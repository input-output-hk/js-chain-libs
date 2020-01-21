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
const getAddressFeedback = form =>
  form
    .find(Form.Control.Feedback)
    .find({ type: 'invalid' })
    .at(0);
const getAmountNegativeFeedback = form =>
  form
    .find(Form.Control.Feedback)
    .find({ type: 'invalid' })
    .at(1);
const getAmountPositiveFeedback = form =>
  form.find(Form.Control.Feedback).find({ type: 'valid' });
const getSubmitButton = form => form.find(Button);

function setup(balance: number, nodeSettings: NodeSettings) {
  const sendFunds = stub();
  const isValidAddress = stub();
  // by default, the address'll be considered valid
  isValidAddress.resolves(true);
  // by default, the transaction is built and broadcasted correctly
  sendFunds.resolves();
  const component = shallow(
    <SendTransaction
      {...{ balance, isValidAddress, nodeSettings, sendFunds }}
    />
  );
  return {
    component,
    sendFunds,
    isValidAddress
  };
}

describe('SendTransaction component', () => {
  test('should match exact snapshot', () => {
    const form = (
      <SendTransaction
        balance={0}
        nodeSettings={defaultNodeSettings}
        sendFunds={stub()}
        isValidAddress={stub()}
      />
    );
    const tree = renderer.create(form).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('Form submission', () => {
    // context: we're clearing the amount field in order to give the user some feedback
    describe('GIVEN a valid form AND a successful sendFunds action', () => {
      // enzyme's shallow render doesn't do proper event bubbling, so
      // we test the submission of the form separetely from the button activation
      let component;
      let sendFunds;
      beforeAll(() => {
        ({ component, sendFunds } = setup(100, defaultNodeSettings));
        getAddressInput(component).simulate('change', {
          target: { value: mockedAddress }
        });
        getAmountInput(component).simulate('change', {
          target: { value: '20' }
        });
        return new Promise(resolve =>
          setTimeout(resolve, config.get('formDebounceInterval'))
        );
      });

      describe('WHEN submitting it', () => {
        beforeAll(() => {
          component.simulate('submit', { preventDefault: () => {} });
        });
        test('THEN the sendFunds action is called', () => {
          expect(sendFunds.callCount).toBe(1);
          expect(
            sendFunds.firstCall.calledWith(mockedAddress, 20)
          ).toBeTruthy();
        });
        test('AND the amount input is cleared', () => {
          expect(getAmountInput(component).prop('value')).toBeFalsy();
        });
        test('AND the submit button is disabled', () => {
          expect(getSubmitButton(component).prop('disabled')).toBeTruthy();
        });
      });
    });

    describe('GIVEN a valid form AND a failing sendFunds action', () => {
      let component;
      let sendFunds;
      beforeAll(() => {
        ({ component, sendFunds } = setup(100, defaultNodeSettings));
        getAddressInput(component).simulate('change', {
          target: { value: mockedAddress }
        });
        sendFunds.rejects();
        getAmountInput(component).simulate('change', {
          target: { value: '20' }
        });
        return new Promise(resolve =>
          setTimeout(resolve, config.get('formDebounceInterval'))
        );
      });

      describe('WHEN submitting it', () => {
        beforeAll(() => {
          component.simulate('submit', { preventDefault: () => {} });
        });
        test('THEN the sendFunds action was called', () => {
          expect(sendFunds.callCount).toBe(1);
          expect(
            sendFunds.firstCall.calledWith(mockedAddress, 20)
          ).toBeTruthy();
        });
        test('AND the amount input not affected', () => {
          expect(getAmountInput(component).prop('value')).toBe(20);
        });
        test('AND the submit button is enabled', () => {
          expect(getSubmitButton(component).prop('disabled')).toBeFalsy();
        });
      });
    });
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

    describe('address validations', () => {
      describe('GIVEN the (mocked) chain libs report an address as invalid', () => {
        let component;
        let isValidAddress;
        beforeAll(() => {
          ({ component, isValidAddress } = setup(100, defaultNodeSettings));
          isValidAddress.resolves(false);
          // validator is debounced, we have to wait for it.
        });
        test('AND the address is not valid or invalid', () => {
          expect(getAddressInput(component).prop('isValid')).toBeFalsy();
          expect(getAddressInput(component).prop('isInvalid')).toBeFalsy();
        });

        describe('WHEN address is entered', () => {
          beforeAll(async () => {
            getAddressInput(component).simulate('change', {
              target: { value: mockedAddress }
            });
            await new Promise(resolve =>
              setTimeout(resolve, config.get('formDebounceInterval'))
            );
          });
          test('THEN the value changed', () => {
            expect(getAddressInput(component).prop('value')).toBe(
              mockedAddress
            );
          });
          test('AND the address is not valid', () => {
            expect(getAddressInput(component).prop('isValid')).toBeFalsy();
          });
          test('AND the address is invalid', () => {
            expect(getAddressInput(component).prop('isInvalid')).toBeTruthy();
          });
          // FIXME: the children'll always be passed, I have to find a way to check if it's being displayed. isEmptyRender() doesn't work because the feedback is implemented as a forwardRef, the form doesn't know if it has to render.
          test('AND an error message is displayed', () => {
            expect(getAddressFeedback(component).prop('children')).toMatch(
              'Please enter a valid address'
            );
          });
        });
      });

      describe('GIVEN the (mocked) chain libs report an address as valid', () => {
        let component;
        let isValidAddress;
        beforeAll(() => {
          ({ component, isValidAddress } = setup(100, defaultNodeSettings));
          isValidAddress.resolves(true);
        });
        test('AND the address is not valid or invalid', () => {
          expect(getAddressInput(component).prop('isValid')).toBeFalsy();
          expect(getAddressInput(component).prop('isInvalid')).toBeFalsy();
        });

        describe('WHEN address is entered', () => {
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
            expect(getAddressInput(component).prop('value')).toBe(
              mockedAddress
            );
          });
          test('AND the address is valid', () => {
            expect(getAddressInput(component).prop('isValid')).toBeTruthy();
          });
          test('AND the address is not invalid', () => {
            expect(getAddressInput(component).prop('isInvalid')).toBeFalsy();
          });
          // TODO: check no error message is displayed
        });
      });
    });
  });
});
