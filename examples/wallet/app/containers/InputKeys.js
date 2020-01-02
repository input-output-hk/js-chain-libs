// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputKeys from '../pages/InputKeys';
import { setAccount, setAccountFromMnemonic } from '../actions/account';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccount, setAccountFromMnemonic }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(InputKeys);
