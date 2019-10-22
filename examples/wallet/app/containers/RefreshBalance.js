// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RefreshBalance from '../components/RefreshBalance';
import { updateBalanceAndCounter } from '../actions/account';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateBalanceAndCounter }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RefreshBalance);
