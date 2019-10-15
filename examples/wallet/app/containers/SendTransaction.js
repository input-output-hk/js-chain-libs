import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SendTransaction from '../components/SendTransaction';
import { setAccount } from '../actions/account';
import { updateBalance } from '../actions/balance';

function mapStateToProps(state) {
  return { privateKey: state.account.privateKey };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAccount, updateBalance }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendTransaction);
