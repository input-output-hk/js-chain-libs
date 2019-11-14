// @flow
import { connect } from 'react-redux';
import type { AppState } from '../reducers/types';
import TransactionListing from '../components/TransactionListing';

function mapStateToProps(state: AppState) {
  const { transactions, address } = state.account;
  return { transactions, myAddress: address };
}

export default connect(mapStateToProps)(TransactionListing);
