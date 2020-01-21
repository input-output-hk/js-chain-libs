// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { AppState } from '../reducers/types';
import RestoreWalletFromPrivateKey from '../components/RestoreWalletFromPrivateKey';
import { setAccount } from '../actions/account';

function mapStateToProps(state: AppState) {
  const { unlockWalletPassword, isValidUnlockPassword } = state.account;
  return { unlockWalletPassword, isValidUnlockPassword };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccount }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestoreWalletFromPrivateKey);
