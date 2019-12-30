// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SendTransaction from '../components/SendTransaction';
import { buildSendFundsAction } from '../actions/account';
import { buildSendFundsTransaction } from '../utils/wasmWrapper';
import { broadcastTransaction } from '../utils/nodeConnection';

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
  mapDispatchToProps
)(SendTransaction);
