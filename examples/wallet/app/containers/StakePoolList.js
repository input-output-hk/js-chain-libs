// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import StakePoolList from '../components/StakePoolList';
import { setStakePools } from '../actions/stakePools';

function mapStateToProps(state) {
  return { stakePools: state.stakePools.availablePools };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setStakePools }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StakePoolList);
