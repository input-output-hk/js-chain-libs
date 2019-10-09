import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

const MainNavbar = () => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand href="/">Cardano explorer</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
  </Navbar>
);

export default MainNavbar;
