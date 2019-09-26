import React from "react";
import Container from "react-bootstrap/Container";

import Search from "./components/Search/Search";
import MainNavbar from "./components/MainNavbar/MainNavbar";
import RecentBlocks from "./components/RecentBlocks/RecentBlocks";

import "./App.css";

const App = () => {
  return (
    <Container fluid>
      <MainNavbar/>
      <Container fluid>
        <Search />
        <RecentBlocks />
      </Container>
    </Container>
  );
}

export default App;
