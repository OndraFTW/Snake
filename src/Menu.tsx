import React from "react";
import styles from "./App.module.scss";

interface MenuProps {
  side: number;
  selected: number;
  options: string[];
  message: string[];
  score: number;
}

export default class Menu extends React.Component<MenuProps> {
  render(): React.ReactNode {
    let printedMenuLines = 0;
    let printedMessageLines = 0;
    const toReturn: React.ReactNode[] = [];
    const firstLine = (
      <div className={styles.menuline}>{"#".repeat(this.props.side)}</div>
    );
    const emptyLine = (
      <div className={styles.menuline}>
        {"#" + " ".repeat(this.props.side - 2) + "#"}
      </div>
    );
    const scoreLine = this.stringToLine(
      "Score: " + this.props.score.toString(),
      false
    );
    toReturn.push(firstLine);
    for (let i = 0; i < this.props.side; i++) {
      if (this.props.options.length > 0 && i === 0) {
        toReturn.push(this.stringToLine("Menu:", false));
      } else if (i % 2 === 0 && printedMenuLines < this.props.options.length) {
        toReturn.push(
          this.stringToLine(
            this.props.options[printedMenuLines],
            this.props.selected === printedMenuLines
          )
        );
        printedMenuLines++;
      } else if (
        i >= this.props.side - 3 - this.props.message.length &&
        printedMessageLines < this.props.message.length
      ) {
        toReturn.push(
          this.stringToLine(this.props.message[printedMessageLines], false)
        );
        printedMessageLines++;
      } else if (i === this.props.side - 2) {
        toReturn.push(scoreLine);
      } else {
        toReturn.push(emptyLine);
      }
    }
    toReturn.push(firstLine);
    return <span className={styles.menu}>{toReturn}</span>;
  }

  stringToLine(s: string, selected: boolean) {
    const prepend = Math.floor((this.props.side - s.length) / 2);
    const append = this.props.side - s.length - prepend;
    let toShow = "";
    if (!selected) {
      toShow = "#" + " ".repeat(prepend - 1) + s + " ".repeat(append - 1) + "#";
    } else {
      toShow =
        "# ->" + " ".repeat(prepend - 4) + s + " ".repeat(append - 4) + "<- #";
    }
    return <div className={styles.menuline}>{toShow}</div>;
  }
}
