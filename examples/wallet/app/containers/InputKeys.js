import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputKeys from '../components/InputKeys';
import { setAddress } from '../actions/account';

function mapStateToProps(state) {
  return state.account;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAddress }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputKeys);
