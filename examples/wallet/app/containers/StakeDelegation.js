// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import StakeDelegation from '../components/StakeDelegation';
import { sendStakeDelegation } from '../actions/account';

function mapStateToProps(state) {
  return { privateKey: state.account.privateKey };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sendStakeDelegation }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StakeDelegation);
