// @flow
import React from 'react';
import type { Node } from 'react';
import Nav from 'react-bootstrap/Nav';
import SVGInline from 'react-svg-inline';
import styles from './SidebarLayout.scss';
import walletIcon from '../assets/images/wallet-ic.inline.svg';
import sendIcon from '../assets/images/send-ic.inline.svg';
import settingsIcon from '../assets/images/settings-ic.inline.svg';
import delegationIcon from '../assets/images/delegation-ic.inline.svg';

type Props = {
  children: Node
};

export default ({ children }: Props) => {
  return (
    <div className={styles.component}>
      <SidebarContent />
      <div>{children}</div>
    </div>
  );
};

const SidebarContent = () => (
  <Nav className={`flex-column justify-content-between ${styles.nav}`}>
    <Nav.Item>
      <ResponsiveSidebarItem icon={walletIcon} text="wallet" />
      <ResponsiveSidebarItem active icon={sendIcon} text="send" />
      <ResponsiveSidebarItem icon={delegationIcon} text="delegate" />
    </Nav.Item>
    <Nav.Item>
      <ResponsiveSidebarItem icon={settingsIcon} text="settings" />
    </Nav.Item>
  </Nav>
);

type SidebarItemProps = {
  icon: string, // actually an svg, but I dont know how to make a type for it
  text: string
};

const ResponsiveSidebarItem = ({ icon, text }: SidebarItemProps) => (
  <div className={styles.sidebarItem}>
    <div className={styles.icon}>
      <SVGInline svg={icon} className="icon" />
    </div>
    <div className={`${styles.text} d-sm-none d-md-block`}>{text}</div>
  </div>
);
