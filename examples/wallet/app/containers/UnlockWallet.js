// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import UnlockWallet from '../pages/UnlockWallet';
import { setKeysWithUnlockWalletPassword } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setKeysWithUnlockWalletPassword }, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(UnlockWallet);
