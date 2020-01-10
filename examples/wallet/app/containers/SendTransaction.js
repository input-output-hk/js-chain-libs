// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SendTransaction from '../components/SendTransaction';
import { sendTransaction } from '../actions/account';

function mapStateToProps(state) {
  return { balance: state.account.balance, nodeSettings: state.nodeSettings };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendTransaction }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendTransaction);
