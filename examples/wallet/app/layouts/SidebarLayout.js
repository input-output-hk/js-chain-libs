// @flow
import React from 'react';
import type { Node } from 'react';
import Nav from 'react-bootstrap/Nav';
import SVGInline from 'react-svg-inline';
import ClickableBox from 'clickable-box';
import typeof { push as Push } from 'connected-react-router';
import styles from './SidebarLayout.scss';
import walletIcon from '../assets/images/wallet-ic.inline.svg';
import sendIcon from '../assets/images/send-ic.inline.svg';
import settingsIcon from '../assets/images/settings-ic.inline.svg';
import delegationIcon from '../assets/images/delegation-ic.inline.svg';
import routes from '../constants/routes.json';

type Props = {
  children: Node,
  pathname: string,
  push: Push
};
type SidebarContentProps = {
  pathname: string,
  push: Push
};

export default ({ children, pathname, push }: Props) => {
  return (
    <div className={styles.component}>
      <SidebarContent pathname={pathname} push={push} />
      <div className={styles.contentWrapper}>{children}</div>
    </div>
  );
};

const SidebarContent = (props: SidebarContentProps) => {
  return (
    <Nav className={`flex-column justify-content-between ${styles.nav}`}>
      <div>
        <ResponsiveSidebarItem
          route={routes.WALLET}
          icon={walletIcon}
          text="wallet"
          {...props}
        />
        <ResponsiveSidebarItem
          route={routes.SEND}
          icon={sendIcon}
          text="send"
          {...props}
        />
        <ResponsiveSidebarItem
          route={routes.STAKING}
          icon={delegationIcon}
          text="delegate"
          {...props}
        />
      </div>
      <ResponsiveSidebarItem
        route={routes.SETTINGS}
        icon={settingsIcon}
        text="settings"
        {...props}
      />
    </Nav>
  );
};

type SidebarItemProps = {
  icon: string, // actually an svg, but I dont know how to make a type for it
  route: string,
  text: string,
  pathname: string,
  push: Push
};

const ResponsiveSidebarItem = ({
  icon,
  text,
  route,
  pathname,
  push
}: SidebarItemProps) => {
  // FIXME: i don't think this is the most accesible solution
  return (
    <ClickableBox onClick={() => push(route)}>
      <Nav.Item
        className={`${styles.sidebarItem} ${
          route === pathname ? styles.activeNav : ''
        }`}
      >
        <div className={styles.icon}>
          <SVGInline svg={icon} className="icon" />
        </div>
        <div className={`${styles.text} d-none d-lg-block`}>{text}</div>
      </Nav.Item>
    </ClickableBox>
  );
};
