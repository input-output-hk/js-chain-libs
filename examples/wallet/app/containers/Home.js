import { connect } from 'react-redux';
import Home from '../components/Home';

function mapStateToProps(state) {
  return { balance: state.balance, address: state.account.address };
}

export default connect(mapStateToProps)(Home);
