// @flow
// @format

import React, { Component } from "react";
import { kanaDictionary } from "../../data/kanaDictionary";
import ShowStage from "./ShowStage";
import Question from "./Question";

type Props = {
  decidedGroups: Array<string>,
  isLocked: boolean,
  handleEndGame: () => void,
  lockStage: (number) => void,
  stage?: number,
  stageUp: () => void,
};

type State = {
  showScreen: string,
};

class Game extends Component<Props, State> {
  state: State = { showScreen: "" };

  componentWillMount() {
    this.setState({ showScreen: "stage" });
  }

  stageUp: () => void = () => {
    this.props.stageUp();
    this.setState({ showScreen: "stage" });
  };

  lockStage: (number) => void = (stage: number) => {
    this.setState({ showScreen: "question" });
    this.props.lockStage(stage);
  };

  showQuestion: () => void = () => {
    this.setState({ showScreen: "question" });
  };

  render(): React$Element<"div"> {
    return (
      <div>
        {this.state.showScreen === "stage" && (
          <ShowStage
            lockStage={this.lockStage}
            handleShowQuestion={this.showQuestion}
            handleEndGame={this.props.handleEndGame}
            stage={this.props.stage}
          />
        )}
        {this.state.showScreen === "question" && (
          <Question
            isLocked={this.props.isLocked}
            handleStageUp={this.stageUp}
            stage={this.props.stage}
            decidedGroups={this.props.decidedGroups}
          />
        )}
      </div>
    );
  }
}

export default Game;
