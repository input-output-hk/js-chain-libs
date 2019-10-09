import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddressInfo from '../components/AddressInfo';
import { setAddress } from '../actions/addressInfo';

function mapStateToProps(state) {
  return state.addressInfo;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setAddress }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressInfo);
