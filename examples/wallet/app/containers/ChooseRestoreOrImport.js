// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import ChooseRestoreOrImport from '../pages/ChooseRestoreOrImport';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ push }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(ChooseRestoreOrImport);
