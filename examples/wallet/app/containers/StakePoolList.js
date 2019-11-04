// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { AppState } from '../reducers/types';
import StakePoolList from '../components/StakePoolList';
import { setStakePools } from '../actions/stakePools';

function mapStateToProps(state: AppState) {
  const { delegation } = state.account;
  return {
    stakePools: state.stakePools.availablePools,
    currentDelegation: delegation && delegation[0] && delegation[0].poolId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setStakePools }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StakePoolList);
