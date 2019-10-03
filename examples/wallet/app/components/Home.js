// @flow
import React, { Component } from 'react';
import AddressInfoContainer from '../containers/AddressInfoContainer';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Example walllet</h2>
        <AddressInfoContainer />
      </div>
    );
  }
}
