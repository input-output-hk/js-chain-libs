// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { redirectToFirstAppPage } from '../actions/router';
import Index from '../pages/Index';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ redirectToFirstAppPage }, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(Index);
