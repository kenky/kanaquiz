// @flow

import React, { Component, useEffect, useState } from "react";
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

function GameContainer(props: Props): React$Element<"div"> {
  const initState: State = {
    stage: 1,
    isLocked: false,
    decidedGroups:
      JSON.parse(localStorage.getItem("decidedGroups") || "") || [],
  };

  const [state, setState] = useState(initState);

  useEffect(() => {
    if (!state.isLocked) setState({ ...state, stage: 1 });
    if (props.gameState === "chooseCharacters")
      setState({ ...state, stage: 1 });
  }, [state.isLocked, props]);

  const startGame: (Array<string>) => void = (decidedGroups: Array<string>) => {
    if (parseInt(state.stage) < 1 || isNaN(parseInt(state.stage)))
      setState({ ...state, stage: 1 });
    else if (parseInt(state.stage) > 4) setState({ ...state, stage: 4 });

    setState({ ...state, decidedGroups: decidedGroups });
    localStorage.setItem("decidedGroups", JSON.stringify(decidedGroups));
    props.handleStartGame();
  };

  const stageUp: () => void = () => {
    setState({ ...state, stage: state.stage + 1 });
  };

  const lockStage: (number, ?boolean) => void = (
    stage: number,
    forceLock: ?boolean
  ) => {
    // if(stage<1 || stage>4) stage=1; // don't use this to allow backspace
    if (forceLock) setState({ ...state, stage: stage, isLocked: true });
    else setState({ ...state, stage: stage, isLocked: !state.isLocked });
  };

  return (
    <div>
      {props.gameState === "chooseCharacters" && (
        <ChooseCharacters
          selectedGroups={state.decidedGroups}
          handleStartGame={startGame}
          stage={state.stage}
          isLocked={state.isLocked}
          lockStage={lockStage}
        />
      )}
      {props.gameState === "game" && (
        <Game
          decidedGroups={state.decidedGroups}
          handleEndGame={props.handleEndGame}
          stageUp={stageUp}
          stage={state.stage}
          isLocked={state.isLocked}
          lockStage={lockStage}
        />
      )}
    </div>
  );
}

export default GameContainer;
