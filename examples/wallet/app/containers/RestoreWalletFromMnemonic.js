// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { AppState } from '../reducers/types';
import RestoreWalletFromMnemonic from '../components/RestoreWalletFromMnemonic';
import { setAccountFromMnemonic } from '../actions/account';

function mapStateToProps(state: AppState) {
  const { unlockWalletPassword, isValidUnlockPassword } = state.account;
  return { unlockWalletPassword, isValidUnlockPassword };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccountFromMnemonic }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestoreWalletFromMnemonic);
