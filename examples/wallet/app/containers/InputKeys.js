import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputKeys from '../components/InputKeys';
import { setAccount } from '../actions/account';
import { updateBalance } from '../actions/balance';
import { updateNodeSettings } from '../actions/nodeSettings';

function mapStateToProps(state) {
  return { privateKey: state.account.privateKey };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { setAccount, updateBalance, updateNodeSettings },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputKeys);
