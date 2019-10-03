// @flow

export const SET_ADDRESS = 'SET_ADDRESS';

export function oldSetAddress(address) {
  return {
    type: SET_ADDRESS,
    address
  };
}

export function setAddress(address) {
  return function setAddressAndRefreshBalance(dispatch) {
    return fetch('http://localhost:8080/example.json').then(async response =>
      dispatch({
        type: SET_ADDRESS,
        address,
        balance: (await response.json()).balance
      })
    );
  };
}
