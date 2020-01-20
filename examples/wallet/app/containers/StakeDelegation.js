// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import StakeDelegation from '../components/StakeDelegation';
import { buildDelegationAction } from '../actions/account';
import { buildDelegateTransaction } from '../utils/wasmWrapper';
import nodeConnectionBuilder from '../utils/nodeConnection';

const { broadcastTransaction } = nodeConnectionBuilder();

function mapStateToProps(state) {
  return { privateKey: state.account.privateKey };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      delegate: buildDelegationAction(
        buildDelegateTransaction,
        broadcastTransaction
      )
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StakeDelegation);
