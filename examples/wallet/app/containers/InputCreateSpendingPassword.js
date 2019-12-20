// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InputCreateSpendingPassword from '../components/InputCreateSpendingPassword';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  undefined,
  mapDispatchToProps
)(InputCreateSpendingPassword);
