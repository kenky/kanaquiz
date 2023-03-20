// @flow

import React, { Component } from 'react';
import './app.scss';
import Navbar from '../Navbar/Navbar';
import GameContainer from '../GameContainer/GameContainer';
import { removeHash } from '../../data/helperFuncs';

const options = {};

type Props = {};

type State = {
  gameState: string,
};

class App extends Component<Props, State> {
  state: State = { gameState: 'chooseCharacters' };
  startGame: (() => void) = () => {
    this.setState({gameState: 'game'});
  }

  endGame: (() => void) = () => {
    this.setState({gameState: 'chooseCharacters'});
  }

  render(): React$Element<"div"> {
    return (
      <div>
        <Navbar
          gameState={this.state.gameState}
          handleEndGame={this.endGame}
        />
        <div className="outercontainer">
          <div className="container game">
            <GameContainer
              gameState={this.state.gameState}
              handleStartGame={this.startGame}
              handleEndGame={this.endGame}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
