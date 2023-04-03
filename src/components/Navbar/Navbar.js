// @flow

import React, { Component } from "react";
import "./Navbar.scss";

type Props = {
  gameState: string,
  handleEndGame: () => void,
};

function Navbar(props: Props): React$Element<"nav"> {
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div className="container">
        <div id="navbar">
          <ul className="nav navbar-nav">
            {props.gameState == "game" ? (
              <li id="nav-choosecharacters">
                <a href="" onClick={props.handleEndGame}>
                  <span className="glyphicon glyphicon-small glyphicon-arrow-left"></span>{" "}
                  Back to menu
                </a>
              </li>
            ) : (
              <li id="nav-kanaquiz">
                <p className="nav navbar-text">Kana Pro</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
