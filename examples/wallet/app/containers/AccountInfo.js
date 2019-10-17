import { connect } from 'react-redux';
import AccountInfo from '../components/AccountInfo';

function mapStateToProps(state) {
  return { balance: state.account.balance, address: state.account.address };
}

export default connect(mapStateToProps)(AccountInfo);
