import React from "react";
import styles from "./App.module.scss";
import { GameState } from "./App";

interface BoardProps {
  side: number;
  fruit: [number, number];
  snake: [number, number][];
  status: GameState;
}

export default class Board extends React.Component<BoardProps> {
  render(): React.ReactNode {
    const toReturn: React.ReactNode[] = [];
    for (var i = -1; i <= this.props.side; i++) {
      var line = "";
      for (var j = -1; j <= this.props.side; j++) {
        if (i === -1 || i === this.props.side) {
          if (j === -1 || j === this.props.side) {
            line += "#";
          } else {
            line += "#";
          }
        } else {
          if (j === -1 || j === this.props.side) {
            line += "#";
          } else {
            line += this.getBoardSpace(i, j);
          }
        }
      }
      toReturn.push(<div className={styles.board}>{line}</div>);
    }
    return toReturn;
  }

  getBoardSpace(i: number, j: number) {
    if (this.props.fruit[0] === i && this.props.fruit[1] === j) {
      return "X";
    }
    for (var s = 0; s < this.props.snake.length; s++) {
      if (this.props.snake[s][0] === i && this.props.snake[s][1] === j) {
        if (s === 0) {
          return "o";
        } else if (
          this.props.snake[s][0] === this.props.snake[s - 1][0] &&
          (s === this.props.snake.length - 1 ||
            this.props.snake[s][0] === this.props.snake[s + 1][0])
        ) {
          return "-";
        } else if (
          this.props.snake[s][1] === this.props.snake[s - 1][1] &&
          (s === this.props.snake.length - 1 ||
            this.props.snake[s][1] === this.props.snake[s + 1][1])
        ) {
          return "|";
        } else {
          return "+";
        }
      }
    }
    return " ";
  }
}
