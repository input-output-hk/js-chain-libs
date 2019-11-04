// @flow
import React from 'react';
import type { Node } from 'react';
import Nav from 'react-bootstrap/Nav';
import SVGInline from 'react-svg-inline';
import { useHistory } from 'react-router-dom';
import ClickableBox from 'clickable-box';
import styles from './SidebarLayout.scss';
import walletIcon from '../assets/images/wallet-ic.inline.svg';
import sendIcon from '../assets/images/send-ic.inline.svg';
import settingsIcon from '../assets/images/settings-ic.inline.svg';
import delegationIcon from '../assets/images/delegation-ic.inline.svg';
import routes from '../constants/routes.json';

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
    <div>
      <ResponsiveSidebarItem
        route={routes.WALLET}
        icon={walletIcon}
        text="wallet"
      />
      <ResponsiveSidebarItem route={routes.SEND} icon={sendIcon} text="send" />
      <ResponsiveSidebarItem
        route={routes.STAKING}
        icon={delegationIcon}
        text="delegate"
      />
    </div>
    <ResponsiveSidebarItem
      route={routes.SETTINGS}
      icon={settingsIcon}
      text="settings"
    />
  </Nav>
);

type SidebarItemProps = {
  icon: string, // actually an svg, but I dont know how to make a type for it
  route: string,
  text: string
};

const ResponsiveSidebarItem = ({ icon, text, route }: SidebarItemProps) => {
  const history = useHistory();
  // FIXME: i don't think this is the most accesible solution
  return (
    <ClickableBox onClick={() => history.push(route)}>
      <Nav.Item
        className={`${styles.sidebarItem} ${
          route === history.location.pathname ? styles.activeNav : ''
        }`}
      >
        <div className={styles.icon}>
          <SVGInline svg={icon} className="icon" />
        </div>
        <div className={`${styles.text} d-sm-none d-md-block`}>{text}</div>
      </Nav.Item>
    </ClickableBox>
  );
};
