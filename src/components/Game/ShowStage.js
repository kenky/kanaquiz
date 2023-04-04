// @flow

import React, { Component, useEffect, useRef, useState } from "react";
import "./ShowStage.scss";
// $FlowFixMe
import { TransitionGroup, CSSTransition } from "react-transition-group";

type Props = {
  stage: number,
  handleEndGame: () => void,
  lockStage: (number) => void,
  handleShowQuestion: () => void,
};
type State = {
  show: boolean,
  entered: boolean,
};

function ShowStage(props: Props): React$Element<"div"> {
  const initState: State = {
    show: false,
    entered: false,
  };
  const [state, setState] = useState(initState);
  const timeoutID = useRef<?TimeoutID>(null);
  useEffect(() => {
    setState({ ...state, show: true });
    if (props.stage <= 4) timeoutID.current = setTimeout(removeStage, 1200); // how soon we start fading out (1500)
    window.scrollTo(0, 0);
    return () => {
      clearTimeout(timeoutID.current);
    };
  }, []);

  const removeStage: () => void = () => {
    setState({ ...state, show: false });
    clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(props.handleShowQuestion, 1000); // how soon we go to question (1000)
  };

  function showStage(): React$Element<"div"> {
    let stageDescription;
    let stageSecondaryDescription;

    if (props.stage == 1) stageDescription = "Choose one";
    else if (props.stage == 2) {
      stageDescription = "Choose one";
      stageSecondaryDescription = "Reverse";
    } else if (props.stage == 3) stageDescription = "Write the answer";
    else if (props.stage == 4) {
      stageDescription = "Write the answer";
      stageSecondaryDescription = "Three at once";
    } else if (props.stage == 5)
      return (
        <div className="text-center show-end">
          <h1>Congratulations!</h1>
          <h3>You have passed all 4 stages.</h3>
          <h4>Would you like to keep playing or go back to menu?</h4>
          <p>
            <button
              className="btn btn-danger keep-playing"
              onClick={() => props.lockStage(4)}
            >
              Keep playing
            </button>
          </p>
          <p>
            <button
              className="btn btn-danger back-to-menu"
              onClick={props.handleEndGame}
            >
              Back to menu
            </button>
          </p>
        </div>
      );

    return (
      <div className="text-center show-stage">
        <h1>Stage {props.stage}</h1>
        <h3>{stageDescription}</h3>
        {stageSecondaryDescription ? <h4>{stageSecondaryDescription}</h4> : ""}
      </div>
    );
  }

  const content = showStage();
  const { show } = state;
  return (
    <CSSTransition
      classNames="stage"
      timeout={{ enter: 900, exit: 900 }}
      in={show}
      unmountOnExit
    >
      {(state) => content}
    </CSSTransition>
  );
}

export default ShowStage;
