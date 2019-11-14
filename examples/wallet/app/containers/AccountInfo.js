// @flow
import { connect } from 'react-redux';
import type { AppState } from '../reducers/types';
import AccountInfo from '../components/AccountInfo';

function mapStateToProps(state: AppState) {
  const { address, balance } = state.account;
  return { address, balance };
}

export default connect(mapStateToProps)(AccountInfo);
