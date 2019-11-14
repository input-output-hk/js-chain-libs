// @flow
import { connect } from 'react-redux';
import type { AppState } from '../reducers/types';
import StakePoolList from '../components/StakePoolList';

function mapStateToProps(state: AppState) {
  const { delegation } = state.account;
  return {
    stakePools: state.stakePools.availablePools,
    currentDelegation: delegation && delegation[0] && delegation[0].poolId
  };
}

export default connect(mapStateToProps)(StakePoolList);
