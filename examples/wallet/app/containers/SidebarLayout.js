// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import type { AppState } from '../reducers/types';
import SidebarLayout from '../layouts/SidebarLayout';

function mapStateToProps(state: AppState) {
  const { pathname } = state.router.location;
  return { pathname };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarLayout);
