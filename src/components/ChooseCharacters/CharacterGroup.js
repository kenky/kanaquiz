// @flow
// @format

import React, { Component } from "react";

type Props = {
  characters: {},
  groupName: string,
  handleToggleSelect: (groupName: string) => void,
  selected: boolean,
};

type State = {
  shownChars: string,
};

class CharacterGroup extends Component<Props, State> {
  state: State = { shownChars: "" };

  changeShownChars(newString: string) {
    this.setState({ shownChars: newString });
  }

  getShowableCharacters(whichKana: string): string {
    let strRomajiCharacters = "";
    let strKanaCharacters = "";
    Object.keys(this.props.characters).map((character) => {
      strRomajiCharacters += this.props.characters[character][0] + " · ";
      strKanaCharacters += character + " · ";
    });
    strRomajiCharacters = strRomajiCharacters.slice(0, -2);
    strKanaCharacters = strKanaCharacters.slice(0, -2);
    if (whichKana == "romaji") return strRomajiCharacters;
    else return strKanaCharacters;
  }

  componentWillMount() {
    this.changeShownChars(this.getShowableCharacters("romaji"));
  }

  render(): React$Element<"div"> {
    return (
      <div
        className={
          "choose-row" +
          (this.props.groupName.endsWith("_a") ||
          this.props.groupName.endsWith("_s")
            ? " alt-row"
            : "") +
          (["h_group16_a", "k_group18_a", "k_group29_a"].includes(
            this.props.groupName
          )
            ? " divider-row"
            : "")
        }
        onClick={() => {
          this.props.handleToggleSelect(this.props.groupName);
          this.changeShownChars(this.getShowableCharacters("romaji"));
        }}
        onMouseDown={() =>
          this.changeShownChars(this.getShowableCharacters("kana"))
        }
        onMouseOut={() =>
          this.changeShownChars(this.getShowableCharacters("romaji"))
        }
        onTouchStart={() =>
          this.changeShownChars(this.getShowableCharacters("kana"))
        }
        onTouchEnd={() =>
          this.changeShownChars(this.getShowableCharacters("romaji"))
        }
      >
        <span
          className={
            this.props.selected
              ? "glyphicon glyphicon-small glyphicon-check"
              : "glyphicon glyphicon-small glyphicon-unchecked"
          }
        ></span>{" "}
        {this.state.shownChars}
      </div>
    );
  }
}

export default CharacterGroup;
