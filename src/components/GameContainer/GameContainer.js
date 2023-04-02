// @flow

import React, { Component } from "react";
import { kanaDictionary } from "../../data/kanaDictionary";
import ChooseCharacters from "../ChooseCharacters/ChooseCharacters";
import Game from "../Game/Game";

type Props = {
  gameState: string,
  handleStartGame: () => void,
  handleEndGame: () => void,
};

type State = {
  stage: number,
  isLocked: boolean,
  decidedGroups: Array<string>,
};
class GameContainer extends Component<Props, State> {
  state: State = {
    stage: 1,
    isLocked: false,
    decidedGroups:
      JSON.parse(localStorage.getItem("decidedGroups") || "") || [],
  };

  componentWillReceiveProps() {
    if (!this.state.isLocked) this.setState({ stage: 1 });
  }

  startGame: (Array<string>) => void = (decidedGroups: Array<string>) => {
    if (parseInt(this.state.stage) < 1 || isNaN(parseInt(this.state.stage)))
      this.setState({ stage: 1 });
    else if (parseInt(this.state.stage) > 4) this.setState({ stage: 4 });

    this.setState({ decidedGroups: decidedGroups });
    localStorage.setItem("decidedGroups", JSON.stringify(decidedGroups));
    this.props.handleStartGame();
  };

  stageUp: () => void = () => {
    this.setState({ stage: this.state.stage + 1 });
  };

  lockStage: () => void = (stage, forceLock) => {
    // if(stage<1 || stage>4) stage=1; // don't use this to allow backspace
    if (forceLock) this.setState({ stage: stage, isLocked: true });
    else this.setState({ stage: stage, isLocked: !this.state.isLocked });
  };

  render(): React$Element<"div"> {
    return (
      <div>
        {this.props.gameState === "chooseCharacters" && (
          <ChooseCharacters
            selectedGroups={this.state.decidedGroups}
            handleStartGame={this.startGame}
            stage={this.state.stage}
            isLocked={this.state.isLocked}
            lockStage={this.lockStage}
          />
        )}
        {this.props.gameState === "game" && (
          <Game
            decidedGroups={this.state.decidedGroups}
            handleEndGame={this.props.handleEndGame}
            stageUp={this.stageUp}
            stage={this.state.stage}
            isLocked={this.state.isLocked}
            lockStage={this.lockStage}
          />
        )}
      </div>
    );
  }
}

export default GameContainer;
