// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputKeys from '../pages/InputKeys';
import { setAccountFromMnemonic, setAccount } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccountFromMnemonic, setAccount }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(InputKeys);
