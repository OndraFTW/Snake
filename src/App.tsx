import React from "react";
import Game, { GameState, GameStatus, Direction } from "./Game";
import styles from "./App.module.scss";

enum AppStatus {
  Start,
  Lost,
  Won,
  Replay,
}

interface AppProps {}

interface AppState {
  side: number;
  tick: number;
  status: AppStatus;
  score: number;
  direction: Direction;
  gameStatus: GameStatus;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.gameFinished = this.gameFinished.bind(this);
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      this.buttonPressed(e);
    });
    this.state = this.getBaseState();
  }

  buttonPressed(e: KeyboardEvent) {
    const newState = { ...this.state };
    switch (e.key) {
      case "ArrowLeft": {
        newState.direction = Direction.Left;
        break;
      }
      case "ArrowRight": {
        newState.direction = Direction.Right;
        break;
      }
      case "ArrowUp": {
        newState.direction = Direction.Up;
        break;
      }
      case "ArrowDown": {
        newState.direction = Direction.Down;
        break;
      }
      case "Enter": {
        if (newState.gameStatus === GameStatus.Stop) {
          newState.direction = Direction.None;
          newState.gameStatus = GameStatus.Play;
        }
        break;
      }
      case "Shift": {
        if (newState.gameStatus === GameStatus.Stop) {
          newState.direction = Direction.None;
          newState.gameStatus = GameStatus.Replay;
        }
        break;
      }
    }
    this.setState(newState);
  }

  getBaseState(): AppState {
    return {
      side: 16,
      tick: 400,
      status: AppStatus.Start,
      score: 0,
      direction: Direction.None,
      gameStatus: GameStatus.Play,
    };
  }

  gameFinished(gameState: GameState) {
    console.log(gameState.fruitHistory);
    console.log(gameState.directionHistory);
    const newState = { ...this.state };
    newState.score = gameState.score;
    newState.status = gameState.won ? AppStatus.Won : AppStatus.Lost;
    newState.gameStatus = GameStatus.Stop;
    this.setState(newState);
  }

  render() {
    var statusBar: React.ReactNode;
    if (this.state.status === AppStatus.Start) {
      statusBar = <div className={styles.statusBar}>Use arrow keys.</div>;
    } else if (this.state.status === AppStatus.Won) {
      statusBar = (
        <div className={styles.statusBar}>
          You won!
          <br />
          Press Enter to restart or Shift to see replay.
        </div>
      );
    } else if (this.state.status === AppStatus.Lost) {
      statusBar = (
        <div className={styles.statusBar}>
          You lost!
          <br />
          Press Enter to restart or Shift to see replay.
        </div>
      );
    } else {
      statusBar = (
        <div className={styles.statusBar}>Score: {this.state.score}</div>
      );
    }
    return (
      <div className={styles.app}>
        <Game
          side={this.state.side}
          tick={this.state.tick}
          finished={this.gameFinished}
          direction={this.state.direction}
          status={this.state.gameStatus}
        />
        {statusBar}
      </div>
    );
  }
}
