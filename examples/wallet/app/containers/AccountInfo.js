// @flow
import { connect } from 'react-redux';
import AccountInfo from '../components/AccountInfo';

function mapStateToProps(state) {
  return { account: state.account };
}

export default connect(mapStateToProps)(AccountInfo);
