// @flow
import { connect } from 'react-redux';
import CreateUnlockWalletPassword from '../components/CreateUnlockWalletPassword';
import { SET_VALID_UNLOCK_WALLET_PASSWORD } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return {
    setValidUnlockWalletPassword: (
      unlockWalletPassword: string,
      isValidUnlockPassword: boolean
    ) =>
      dispatch({
        type: SET_VALID_UNLOCK_WALLET_PASSWORD,
        unlockWalletPassword,
        isValidUnlockPassword
      })
  };
}

export default connect(
  undefined,
  mapDispatchToProps
)(CreateUnlockWalletPassword);
