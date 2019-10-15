import { connect } from 'react-redux';
import AccountInfo from '../components/AccountInfo';

function mapStateToProps(state) {
  return { balance: state.balance, address: state.account.address };
}

export default connect(mapStateToProps)(AccountInfo);
