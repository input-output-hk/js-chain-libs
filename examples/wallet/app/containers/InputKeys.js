// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputKeys from '../pages/InputKeys';
import { setAccount, setAccountFromMnemonic } from '../actions/account';
import { updateNodeSettings } from '../actions/nodeSettings';

function mapStateToProps(state) {
  return {
    privateKey: state.account.privateKey,
    mnemonicPhrase: state.account.mnemonicPhrase,
    mnemonicPassword: state.account.mnemonicPassword
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setAccount,
      updateNodeSettings,
      setAccountFromMnemonic
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputKeys);
