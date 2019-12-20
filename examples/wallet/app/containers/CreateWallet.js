// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import CreateWallet from '../pages/CreateWallet';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ push }, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(CreateWallet);
