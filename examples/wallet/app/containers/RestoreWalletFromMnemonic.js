// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RestoreWalletFromMnemonic from '../components/RestoreWalletFromMnemonic';
import { setAccountFromMnemonic } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccountFromMnemonic }, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(RestoreWalletFromMnemonic);
