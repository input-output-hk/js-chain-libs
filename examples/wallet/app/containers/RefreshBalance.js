// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RefreshBalance from '../components/RefreshBalance';
import { updateAccountState } from '../actions/account';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateAccountState }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RefreshBalance);
