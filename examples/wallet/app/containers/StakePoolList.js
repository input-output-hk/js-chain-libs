// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { PoolId } from '../models';
import StakePoolList from '../components/StakePoolList';
import { setStakePools } from '../actions/stakePools';

type SetStakePools = typeof setStakePools;

type Props = {
  onSelection: (poolId: PoolId) => void,
  setStakePools: SetStakePools,
  stakePools: Array<PoolId>
};

class StakePoolListContainer extends React.Component<Props> {
  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.setStakePools();
  }

  render() {
    const { stakePools, onSelection } = this.props;

    return <StakePoolList {...{ stakePools, onSelection }} />;
  }
}

function mapStateToProps(state) {
  return { stakePools: state.stakePools.availablePools };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setStakePools }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StakePoolListContainer);
