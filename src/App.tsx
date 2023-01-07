import React from "react";
import Game, { GameState, Direction } from "./Game";
import Menu from "./Menu";
import styles from "./App.module.scss";

export enum AppStatus {
  Play,
  Menu,
  Replay,
}

interface AppProps {}

interface AppState {
  side: number;
  tick: number;
  status: AppStatus;
  score: number;
  won: boolean;
  direction: Direction;
  options: string[];
  selectedOption: number;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.updateScore = this.updateScore.bind(this);
    this.gameFinished = this.gameFinished.bind(this);
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      this.buttonPressed(e);
    });
    this.state = this.getBaseState();
  }

  isInGame() {
    return ![AppStatus.Menu].includes(this.state.status);
  }

  buttonPressed(e: KeyboardEvent) {
    const newState = { ...this.state };
    switch (e.key) {
      case "ArrowLeft": {
        if (this.isInGame()) {
          newState.direction = Direction.Left;
        }
        break;
      }
      case "ArrowRight": {
        if (this.isInGame()) {
          newState.direction = Direction.Right;
        }
        break;
      }
      case "ArrowUp": {
        if (this.isInGame()) {
          newState.direction = Direction.Up;
        } else {
          if (newState.selectedOption === 0) {
            newState.selectedOption = newState.options.length - 1;
          } else {
            newState.selectedOption =
              (newState.selectedOption - 1) % newState.options.length;
          }
        }
        break;
      }
      case "ArrowDown": {
        if (this.isInGame()) {
          newState.direction = Direction.Down;
        } else {
          newState.selectedOption =
            (newState.selectedOption + 1) % newState.options.length;
        }
        break;
      }
      case "Enter": {
        if (!this.isInGame()) {
          if (newState.selectedOption === 0) {
            newState.direction = Direction.None;
            newState.status = AppStatus.Play;
          } else {
            newState.direction = Direction.None;
            newState.status = AppStatus.Replay;
          }
          newState.options = [];
        }
        break;
      }
    }
    this.setState(newState);
  }

  getMessage(status: AppStatus) {
    switch (status) {
      case AppStatus.Play: {
        return ["Use arrow", " keys to", "control", "the sanke."];
      }
      case AppStatus.Menu: {
        return this.state.won ? ["You won!"] : ["You lost!"];
      }
      case AppStatus.Replay: {
        return ["Replaying", "the last game"];
      }
      default: {
        return [""];
      }
    }
  }

  getBaseState(): AppState {
    return {
      side: 16,
      tick: 400,
      won: false,
      status: AppStatus.Play,
      score: 0,
      direction: Direction.None,
      options: [],
      selectedOption: 0,
    };
  }

  updateScore(score: number) {
    const newState = { ...this.state };
    newState.score = score;
    this.setState(newState);
  }

  gameFinished(gameState: GameState) {
    const newState = { ...this.state };
    newState.status = AppStatus.Menu;
    newState.won = gameState.won;
    newState.options = ["Restart", "Replay"];
    this.setState(newState);
  }

  render() {
    return (
      <div className={styles.app}>
        <Game
          side={this.state.side}
          tick={this.state.tick}
          finished={this.gameFinished}
          scoreUpdated={this.updateScore}
          direction={this.state.direction}
          status={this.state.status}
        />
        <Menu
          side={this.state.side}
          selected={this.state.selectedOption}
          options={this.state.options}
          message={this.getMessage(this.state.status)}
          score={this.state.score}
        />
      </div>
    );
  }
}
