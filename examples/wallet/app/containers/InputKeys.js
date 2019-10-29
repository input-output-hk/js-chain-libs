// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputKeys from '../pages/InputKeys';
import { setAccount } from '../actions/account';
import { updateNodeSettings } from '../actions/nodeSettings';

function mapStateToProps(state) {
  return { privateKey: state.account.privateKey };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccount, updateNodeSettings }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputKeys);
