import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SendTransaction from '../components/SendTransaction';
import { sendTransaction } from '../actions/account';

function mapStateToProps(state) {
  return { privateKey: state.account.privateKey };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendTransaction }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendTransaction);
