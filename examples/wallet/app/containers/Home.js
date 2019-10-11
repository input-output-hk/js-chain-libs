import { connect } from 'react-redux';
import Home from '../components/Home';

function mapStateToProps(state) {
  return state.account;
}

export default connect(mapStateToProps)(Home);
