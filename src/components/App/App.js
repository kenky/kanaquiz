// @flow

import React, { Component, useState } from "react";
import "./app.scss";
import Navbar from "../Navbar/Navbar";
import GameContainer from "../GameContainer/GameContainer";
import { removeHash } from "../../data/helperFuncs";

const options = {};

type Props = {};

type State = {
  gameState: string,
};

function App(): React$Element<"div"> {
  const [gameState, setGameState] = useState("chooseCharacters");
  const startGame: () => void = () => {
    setGameState("game");
  };

  const endGame: () => void = () => {
    setGameState("chooseCharacters");
  };

  return (
    <div>
      <Navbar gameState={gameState} handleEndGame={endGame} />
      <div className="outercontainer">
        <div className="container game">
          <GameContainer
            gameState={gameState}
            handleStartGame={startGame}
            handleEndGame={endGame}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
