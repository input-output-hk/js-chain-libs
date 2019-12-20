// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateWallet from '../pages/CreateWallet';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(CreateWallet);
