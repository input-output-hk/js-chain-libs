// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SendTransaction from '../components/SendTransaction';
import { buildSendFundsAction } from '../actions/account';
import {
  buildSendFundsTransaction,
  isValidAddress
} from '../utils/wasmWrapper';
import nodeConnectionBuilder from '../utils/nodeConnection';

const { broadcastTransaction } = nodeConnectionBuilder();

function mapStateToProps(state) {
  return { balance: state.account.balance, nodeSettings: state.nodeSettings };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      sendFunds: buildSendFundsAction(
        buildSendFundsTransaction,
        broadcastTransaction
      )
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    isValidAddress
  })
)(SendTransaction);
