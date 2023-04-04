// @flow

import React, { Component, useEffect, useRef, useState } from "react";
// $FlowFixMe
import Switch from "react-toggle-switch";
import { kanaDictionary } from "../../data/kanaDictionary";
import "./ChooseCharacters.scss";
import CharacterGroup from "./CharacterGroup";

type Props = {
  isLocked: boolean,
  selectedGroups: Array<string>,
  handleStartGame: (Array<string>) => void,
  lockStage: (number, ?boolean) => void,
  stage?: number,
};

type State = {
  errMsg: string,
  selectedGroups: Array<string>,
  showAlternatives: Array<string>,
  showSimilars: Array<string>,
  startIsVisible: boolean,
};

function ChooseCharacters(props: Props): React$Element<"div"> {
  const initState: State = {
    errMsg: "",
    selectedGroups: props.selectedGroups,
    showAlternatives: [],
    showSimilars: [],
    startIsVisible: true,
  };
  const [state, setState] = useState(initState);
  const startRef = useRef();

  useEffect(() => {
    if (startRef) {
      testIsStartVisible();
      window.addEventListener("resize", testIsStartVisible);
      window.addEventListener("scroll", testIsStartVisible);
      return () => {
        window.removeEventListener("resize", testIsStartVisible);
        window.removeEventListener("scroll", testIsStartVisible);
      };
    } else {
      testIsStartVisible();
    }
  }, []);

  const testIsStartVisible: () => void = () => {
    // $FlowFixMe
    if (startRef.current) {
      // $FlowFixMe
      const rect = startRef.current.getBoundingClientRect();
      if (rect.y > window.innerHeight && state.startIsVisible)
        setState({ ...state, startIsVisible: false });
      else if (rect.y <= window.innerHeight && !state.startIsVisible)
        setState({ ...state, startIsVisible: true });
    }
  };

  function scrollToStart() {
    // $FlowFixMe
    if (startRef.current) {
      // $FlowFixMe
      const rect = startRef.current.getBoundingClientRect();
      const absTop = rect.top + window.pageYOffset;
      const scrollPos = absTop - window.innerHeight + 50;
      window.scrollTo(0, scrollPos > 0 ? scrollPos : 0);
    }
  }

  function getIndex(groupName: string): number {
    return state.selectedGroups.indexOf(groupName);
  }

  function isSelected(groupName: string): boolean {
    return getIndex(groupName) > -1 ? true : false;
  }

  function removeSelect(groupName: string) {
    if (getIndex(groupName) < 0) return;
    let newSelectedGroups = state.selectedGroups.slice();
    newSelectedGroups.splice(getIndex(groupName), 1);
    setState({ ...state, selectedGroups: newSelectedGroups });
  }

  function addSelect(groupName: string) {
    setState({
      ...state,
      errMsg: "",
      selectedGroups: state.selectedGroups.concat(groupName),
    });
  }

  const toggleSelect: (string) => void = (groupName: string) => {
    if (getIndex(groupName) > -1) removeSelect(groupName);
    else addSelect(groupName);
  };

  function selectAll(
    whichKana: string,
    altOnly: boolean = false,
    similarOnly: boolean = false
  ) {
    const thisKana = kanaDictionary[whichKana];
    let newSelectedGroups = state.selectedGroups.slice();
    Object.keys(thisKana).forEach((groupName) => {
      if (
        !isSelected(groupName) &&
        ((altOnly && groupName.endsWith("_a")) ||
          (similarOnly && groupName.endsWith("_s")) ||
          (!altOnly && !similarOnly))
      )
        newSelectedGroups.push(groupName);
    });
    setState({ ...state, errMsg: "", selectedGroups: newSelectedGroups });
  }

  function selectNone(
    whichKana: string,
    altOnly: boolean = false,
    similarOnly: boolean = false
  ) {
    let newSelectedGroups = [];
    state.selectedGroups.forEach((groupName) => {
      let mustBeRemoved = false;
      Object.keys(kanaDictionary[whichKana]).forEach((removableGroupName) => {
        if (
          removableGroupName === groupName &&
          ((altOnly && groupName.endsWith("_a")) ||
            (similarOnly && groupName.endsWith("_s")) ||
            (!altOnly && !similarOnly))
        )
          mustBeRemoved = true;
      });
      if (!mustBeRemoved) newSelectedGroups.push(groupName);
    });
    setState({ ...state, selectedGroups: newSelectedGroups });
  }

  function toggleAlternative(whichKana: string, postfix: string) {
    let show: Array<string> =
      postfix == "_a" ? state.showAlternatives : state.showSimilars;
    const idx = show.indexOf(whichKana);
    if (idx >= 0) show.splice(idx, 1);
    else show.push(whichKana);
    if (postfix == "_a") setState({ ...state, showAlternatives: show });
    if (postfix == "_s") setState({ ...state, showSimilars: show });
  }

  function getSelectedAlternatives(whichKana: string, postfix: string): number {
    return state.selectedGroups.filter((groupName) => {
      return (
        groupName.startsWith(whichKana == "hiragana" ? "h_" : "k_") &&
        groupName.endsWith(postfix)
      );
    }).length;
  }

  function getAmountOfAlternatives(whichKana: string, postfix: string): number {
    return Object.keys(kanaDictionary[whichKana]).filter((groupName) => {
      return groupName.endsWith(postfix);
    }).length;
  }

  function alternativeToggleRow(
    whichKana: string,
    postfix: string,
    show: boolean
  ): React$Element<"div"> {
    let checkBtn = "glyphicon glyphicon-small glyphicon-";
    let status;
    if (
      getSelectedAlternatives(whichKana, postfix) >=
      getAmountOfAlternatives(whichKana, postfix)
    )
      status = "check";
    else if (getSelectedAlternatives(whichKana, postfix) > 0)
      status = "check half";
    else status = "unchecked";
    checkBtn += status;

    return (
      <div
        key={"alt_toggle_" + whichKana + postfix}
        onClick={() => toggleAlternative(whichKana, postfix)}
        className="choose-row"
      >
        <span
          className={checkBtn}
          onClick={(e) => {
            if (status == "check")
              selectNone(whichKana, postfix == "_a", postfix == "_s");
            else if (status == "check half" || status == "unchecked")
              selectAll(whichKana, postfix == "_a", postfix == "_s");
            e.stopPropagation();
          }}
        ></span>
        {show ? (
          <span className="toggle-caret">&#9650;</span>
        ) : (
          <span className="toggle-caret">&#9660;</span>
        )}
        {postfix == "_a"
          ? "Alternative characters (ga · ba · kya..)"
          : "Look-alike characters"}
      </div>
    );
  }

  function showGroupRows(
    whichKana: string,
    showAlternatives: boolean,
    showSimilars: boolean = false
  ): Array<React$Element<"div">> {
    const thisKana = kanaDictionary[whichKana];
    let rows = [];
    Object.keys(thisKana).forEach((groupName, idx) => {
      if (groupName == "h_group11_a" || groupName == "k_group13_a")
        rows.push(alternativeToggleRow(whichKana, "_a", showAlternatives));
      if (groupName == "k_group11_s")
        rows.push(alternativeToggleRow(whichKana, "_s", showSimilars));

      if (
        (!groupName.endsWith("a") || showAlternatives) &&
        (!groupName.endsWith("s") || showSimilars)
      ) {
        rows.push(
          // $FlowFixMe
          <CharacterGroup
            key={idx}
            groupName={groupName}
            selected={isSelected(groupName)}
            characters={thisKana[groupName].characters}
            handleToggleSelect={toggleSelect}
          />
        );
      }
    });

    return rows;
  }

  function startGame() {
    if (state.selectedGroups.length < 1) {
      setState({ ...state, errMsg: "Choose at least one group!" });
      return;
    }
    props.handleStartGame(state.selectedGroups);
  }

  return (
    <div className="choose-characters">
      <div className="row">
        <div className="col-xs-12">
          <div className="panel panel-default">
            <div className="panel-body welcome">
              <h4>Welcome to Kana Pro!</h4>
              <p>
                Please choose the groups of characters that you'd like to be
                studying.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="panel panel-default">
            <div className="panel-heading">Hiragana · ひらがな</div>
            <div className="panel-body selection-areas">
              {showGroupRows(
                "hiragana",
                state.showAlternatives.indexOf("hiragana") >= 0
              )}
            </div>
            <div className="panel-footer text-center">
              <a href="" onClick={() => selectAll("hiragana")}>
                All
              </a>{" "}
              &nbsp;&middot;&nbsp;{" "}
              <a href="" onClick={() => selectNone("hiragana")}>
                None
              </a>
              &nbsp;&middot;&nbsp;{" "}
              <a href="" onClick={() => selectAll("hiragana", true)}>
                All alternative
              </a>
              &nbsp;&middot;&nbsp;{" "}
              <a href="" onClick={() => selectNone("hiragana", true)}>
                No alternative
              </a>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="panel panel-default">
            <div className="panel-heading">Katakana · カタカナ</div>
            <div className="panel-body selection-areas">
              {showGroupRows(
                "katakana",
                state.showAlternatives.indexOf("katakana") >= 0,
                state.showSimilars.indexOf("katakana") >= 0
              )}
            </div>
            <div className="panel-footer text-center">
              <a href="" onClick={() => selectAll("katakana")}>
                All
              </a>{" "}
              &nbsp;&middot;&nbsp;{" "}
              <a href="" onClick={() => selectNone("katakana")}>
                None
              </a>
              &nbsp;&middot;&nbsp;{" "}
              <a href="" onClick={() => selectAll("katakana", true)}>
                All alternative
              </a>
              &nbsp;&middot;&nbsp;{" "}
              <a href="" onClick={() => selectNone("katakana", true)}>
                No alternative
              </a>
            </div>
          </div>
        </div>
        <div className="col-sm-3 col-xs-12 pull-right">
          <span className="pull-right lock">
            Lock to stage &nbsp;
            {props.isLocked && (
              <input
                className="stage-choice"
                type="number"
                min="1"
                max="4"
                maxLength="1"
                size="1"
                onChange={(e) => props.lockStage(e.target.value, true)}
                value={props.stage}
              />
            )}
            <Switch onClick={() => props.lockStage(1)} on={props.isLocked} />
          </span>
        </div>
        <div className="col-sm-offset-3 col-sm-6 col-xs-12 text-center">
          {state.errMsg != "" && (
            <div className="error-message">{state.errMsg}</div>
          )}
          <button
            // $FlowFixMe
            ref={(c) => (startRef.current = c)}
            className="btn btn-danger startgame-button"
            onClick={() => startGame()}
          >
            Start the Quiz!
          </button>
        </div>
        <div
          className="down-arrow"
          style={{ display: state.startIsVisible ? "none" : "block" }}
          // $FlowFixMe
          onClick={(e) => scrollToStart(e)}
        >
          Start
        </div>
      </div>
    </div>
  );
}

export default ChooseCharacters;
