// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RestoreWalletFromMnemonic from '../components/RestoreWalletFromMnemonic';
import { setAccount } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccount }, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(RestoreWalletFromMnemonic);
