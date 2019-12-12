// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RestoreWalletFromPrivateKey from '../components/RestoreWalletFromPrivateKey';
import { setAccount } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccount }, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(RestoreWalletFromPrivateKey);
