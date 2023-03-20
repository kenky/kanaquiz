// @flow
// @format

import React, { Component } from "react";
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

class ChooseCharacters extends Component<Props, State> {
  state: State = {
    errMsg: "",
    selectedGroups: this.props.selectedGroups,
    showAlternatives: [],
    showSimilars: [],
    startIsVisible: true,
  };

  componentDidMount() {
    this.testIsStartVisible();
    window.addEventListener("resize", this.testIsStartVisible);
    window.addEventListener("scroll", this.testIsStartVisible);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.testIsStartVisible);
    window.removeEventListener("scroll", this.testIsStartVisible);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    this.testIsStartVisible();
  }

  testIsStartVisible: () => void = () => {
    // $FlowFixMe
    if (this.startRef) {
      // $FlowFixMe
      const rect = this.startRef.getBoundingClientRect();
      if (rect.y > window.innerHeight && this.state.startIsVisible)
        this.setState({ startIsVisible: false });
      else if (rect.y <= window.innerHeight && !this.state.startIsVisible)
        this.setState({ startIsVisible: true });
    }
  };

  scrollToStart() {
    // $FlowFixMe
    if (this.startRef) {
      // $FlowFixMe
      const rect = this.startRef.getBoundingClientRect();
      const absTop = rect.top + window.pageYOffset;
      const scrollPos = absTop - window.innerHeight + 50;
      window.scrollTo(0, scrollPos > 0 ? scrollPos : 0);
    }
  }

  getIndex(groupName: string): number {
    return this.state.selectedGroups.indexOf(groupName);
  }

  isSelected(groupName: string): boolean {
    return this.getIndex(groupName) > -1 ? true : false;
  }

  removeSelect(groupName: string) {
    if (this.getIndex(groupName) < 0) return;
    let newSelectedGroups = this.state.selectedGroups.slice();
    newSelectedGroups.splice(this.getIndex(groupName), 1);
    this.setState({ selectedGroups: newSelectedGroups });
  }

  addSelect(groupName: string) {
    this.setState({
      errMsg: "",
      selectedGroups: this.state.selectedGroups.concat(groupName),
    });
  }

  toggleSelect: (string) => void = (groupName: string) => {
    if (this.getIndex(groupName) > -1) this.removeSelect(groupName);
    else this.addSelect(groupName);
  };

  selectAll(
    whichKana: string,
    altOnly: boolean = false,
    similarOnly: boolean = false
  ) {
    const thisKana = kanaDictionary[whichKana];
    let newSelectedGroups = this.state.selectedGroups.slice();
    Object.keys(thisKana).forEach((groupName) => {
      if (
        !this.isSelected(groupName) &&
        ((altOnly && groupName.endsWith("_a")) ||
          (similarOnly && groupName.endsWith("_s")) ||
          (!altOnly && !similarOnly))
      )
        newSelectedGroups.push(groupName);
    });
    this.setState({ errMsg: "", selectedGroups: newSelectedGroups });
  }

  selectNone(
    whichKana: string,
    altOnly: boolean = false,
    similarOnly: boolean = false
  ) {
    let newSelectedGroups = [];
    this.state.selectedGroups.forEach((groupName) => {
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
    this.setState({ selectedGroups: newSelectedGroups });
  }

  toggleAlternative(whichKana: string, postfix: string) {
    let show: Array<string> =
      postfix == "_a" ? this.state.showAlternatives : this.state.showSimilars;
    const idx = show.indexOf(whichKana);
    if (idx >= 0) show.splice(idx, 1);
    else show.push(whichKana);
    if (postfix == "_a") this.setState({ showAlternatives: show });
    if (postfix == "_s") this.setState({ showSimilars: show });
  }

  getSelectedAlternatives(whichKana: string, postfix: string): number {
    return this.state.selectedGroups.filter((groupName) => {
      return (
        groupName.startsWith(whichKana == "hiragana" ? "h_" : "k_") &&
        groupName.endsWith(postfix)
      );
    }).length;
  }

  getAmountOfAlternatives(whichKana: string, postfix: string): number {
    return Object.keys(kanaDictionary[whichKana]).filter((groupName) => {
      return groupName.endsWith(postfix);
    }).length;
  }

  alternativeToggleRow(
    whichKana: string,
    postfix: string,
    show: boolean
  ): React$Element<"div"> {
    let checkBtn = "glyphicon glyphicon-small glyphicon-";
    let status;
    if (
      this.getSelectedAlternatives(whichKana, postfix) >=
      this.getAmountOfAlternatives(whichKana, postfix)
    )
      status = "check";
    else if (this.getSelectedAlternatives(whichKana, postfix) > 0)
      status = "check half";
    else status = "unchecked";
    checkBtn += status;

    return (
      <div
        key={"alt_toggle_" + whichKana + postfix}
        onClick={() => this.toggleAlternative(whichKana, postfix)}
        className="choose-row"
      >
        <span
          className={checkBtn}
          onClick={(e) => {
            if (status == "check")
              this.selectNone(whichKana, postfix == "_a", postfix == "_s");
            else if (status == "check half" || status == "unchecked")
              this.selectAll(whichKana, postfix == "_a", postfix == "_s");
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

  showGroupRows(
    whichKana: string,
    showAlternatives: boolean,
    showSimilars: boolean = false
  ): Array<React$Element<"div">> {
    const thisKana = kanaDictionary[whichKana];
    let rows = [];
    Object.keys(thisKana).forEach((groupName, idx) => {
      if (groupName == "h_group11_a" || groupName == "k_group13_a")
        rows.push(this.alternativeToggleRow(whichKana, "_a", showAlternatives));
      if (groupName == "k_group11_s")
        rows.push(this.alternativeToggleRow(whichKana, "_s", showSimilars));

      if (
        (!groupName.endsWith("a") || showAlternatives) &&
        (!groupName.endsWith("s") || showSimilars)
      ) {
        rows.push(
          // $FlowFixMe
          <CharacterGroup
            key={idx}
            groupName={groupName}
            selected={this.isSelected(groupName)}
            characters={thisKana[groupName].characters}
            handleToggleSelect={this.toggleSelect}
          />
        );
      }
    });

    return rows;
  }

  startGame() {
    if (this.state.selectedGroups.length < 1) {
      this.setState({ errMsg: "Choose at least one group!" });
      return;
    }
    this.props.handleStartGame(this.state.selectedGroups);
  }

  render(): React$Element<"div"> {
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
                {this.showGroupRows(
                  "hiragana",
                  this.state.showAlternatives.indexOf("hiragana") >= 0
                )}
              </div>
              <div className="panel-footer text-center">
                <a
                  href="javascript:;"
                  onClick={() => this.selectAll("hiragana")}
                >
                  All
                </a>{" "}
                &nbsp;&middot;&nbsp;{" "}
                <a
                  href="javascript:;"
                  onClick={() => this.selectNone("hiragana")}
                >
                  None
                </a>
                &nbsp;&middot;&nbsp;{" "}
                <a
                  href="javascript:;"
                  onClick={() => this.selectAll("hiragana", true)}
                >
                  All alternative
                </a>
                &nbsp;&middot;&nbsp;{" "}
                <a
                  href="javascript:;"
                  onClick={() => this.selectNone("hiragana", true)}
                >
                  No alternative
                </a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="panel panel-default">
              <div className="panel-heading">Katakana · カタカナ</div>
              <div className="panel-body selection-areas">
                {this.showGroupRows(
                  "katakana",
                  this.state.showAlternatives.indexOf("katakana") >= 0,
                  this.state.showSimilars.indexOf("katakana") >= 0
                )}
              </div>
              <div className="panel-footer text-center">
                <a
                  href="javascript:;"
                  onClick={() => this.selectAll("katakana")}
                >
                  All
                </a>{" "}
                &nbsp;&middot;&nbsp;{" "}
                <a
                  href="javascript:;"
                  onClick={() => this.selectNone("katakana")}
                >
                  None
                </a>
                &nbsp;&middot;&nbsp;{" "}
                <a
                  href="javascript:;"
                  onClick={() => this.selectAll("katakana", true)}
                >
                  All alternative
                </a>
                &nbsp;&middot;&nbsp;{" "}
                <a
                  href="javascript:;"
                  onClick={() => this.selectNone("katakana", true)}
                >
                  No alternative
                </a>
              </div>
            </div>
          </div>
          <div className="col-sm-3 col-xs-12 pull-right">
            <span className="pull-right lock">
              Lock to stage &nbsp;
              {this.props.isLocked && (
                <input
                  className="stage-choice"
                  type="number"
                  min="1"
                  max="4"
                  maxLength="1"
                  size="1"
                  onChange={(e) => this.props.lockStage(e.target.value, true)}
                  value={this.props.stage}
                />
              )}
              <Switch
                onClick={() => this.props.lockStage(1)}
                on={this.props.isLocked}
              />
            </span>
          </div>
          <div className="col-sm-offset-3 col-sm-6 col-xs-12 text-center">
            {this.state.errMsg != "" && (
              <div className="error-message">{this.state.errMsg}</div>
            )}
            <button
              // $FlowFixMe
              ref={(c) => (this.startRef = c)}
              className="btn btn-danger startgame-button"
              onClick={() => this.startGame()}
            >
              Start the Quiz!
            </button>
          </div>
          <div
            className="down-arrow"
            style={{ display: this.state.startIsVisible ? "none" : "block" }}
            // $FlowFixMe
            onClick={(e) => this.scrollToStart(e)}
          >
            Start
          </div>
        </div>
      </div>
    );
  }
}

export default ChooseCharacters;
