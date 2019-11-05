// @flow
import React from 'react';
import QRCode from 'qrcode.react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import type { Address, Balance } from '../models';
import styles from './AccountInfo.scss';

type Props = {
  address: Address,
  balance: Balance
};

export default ({ address, balance }: Props) => {
  if (address === undefined || balance === undefined) return null;
  return (
    <Container>
      <Row className="justify-content-center m-2">
        <h2> Account Info</h2>
      </Row>
      <Row>
        <QRCode className={styles.qr} includeMargin value={address} />
        <div className={styles.addressAndBalanceContainer}>
          <h5>Current Address: {address}</h5>
          <h3>Balance: {balance}</h3>
        </div>
      </Row>
    </Container>
  );
};
