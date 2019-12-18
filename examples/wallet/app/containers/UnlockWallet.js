// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import UnlockWallet from '../pages/UnlockWallet';
import { setKeysWithSpendingPassword } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setKeysWithSpendingPassword }, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(UnlockWallet);
