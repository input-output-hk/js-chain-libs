import { connect } from 'react-redux';
import Index from '../pages/Index';

function mapStateToProps(state) {
  return state.account;
}

export default connect(mapStateToProps)(Index);
