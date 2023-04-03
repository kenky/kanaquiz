// @flow

import React, { Component, useEffect, useState } from "react";
import { kanaDictionary } from "../../data/kanaDictionary";
import ShowStage from "./ShowStage";
import Question from "./Question";

type Props = {
  decidedGroups: Array<string>,
  isLocked: boolean,
  handleEndGame: () => void,
  lockStage: (number, ?boolean) => void,
  stage: number,
  stageUp: () => void,
};

function Game(props: Props): React$Element<"div"> {
  const [showScreen, setShowScreen] = useState("");
  useEffect(() => {
    setShowScreen("stage");
  }, []);

  const stageUp: () => void = () => {
    props.stageUp();
    setShowScreen("stage");
  };

  const lockStage: (number) => void = (stage: number) => {
    setShowScreen("question");
    props.lockStage(stage);
  };

  const showQuestion: () => void = () => {
    setShowScreen("question");
  };

  return (
    <div>
      {showScreen === "stage" && (
        <ShowStage
          lockStage={lockStage}
          handleShowQuestion={showQuestion}
          handleEndGame={props.handleEndGame}
          stage={props.stage}
        />
      )}
      {showScreen === "question" && (
        <Question
          isLocked={props.isLocked}
          handleStageUp={stageUp}
          stage={props.stage}
          decidedGroups={props.decidedGroups}
        />
      )}
    </div>
  );
}

export default Game;
