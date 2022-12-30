import React from "react";
import Board from "./Board";
import styles from "./App.module.scss";

const SIDE = 16;
const TICK_MS = 400;

export enum GameState {
  Left,
  Right,
  Up,
  Down,
  Start,
  Won,
  Lost,
}

interface AppState {
  status: GameState;
  snake: [number, number][];
  fruit: [number, number];
}

interface AppProps {}

export default class App extends React.Component<AppProps, AppState> {
  interval?: NodeJS.Timer;

  constructor(props: AppProps) {
    super(props);
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      this.buttonPressed(e);
    });
    this.state = this.getBaseState();
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), TICK_MS);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.gameStep();
  }

  buttonPressed(e: KeyboardEvent) {
    const statusAfterButton = this.buttonToState(e, this.state.status);
    if (statusAfterButton === GameState.Start) {
      this.setState(this.getBaseState());
    } else {
      const newState = { ...this.state };
      newState.status = statusAfterButton;
      this.setState(newState);
    }
  }

  gameStep() {
    if (
      [GameState.Start, GameState.Won, GameState.Lost].includes(
        this.state.status
      )
    ) {
      return;
    }
    const newState = { ...this.state };
    const newHead = this.getNewHead(newState.status, this.state.snake[0]);
    const ateFruit =
      newHead[0] === this.state.fruit[0] && newHead[1] === this.state.fruit[1];
    newState.snake = [
      newHead,
      ...this.state.snake.slice(
        0,
        ateFruit ? this.state.snake.length : this.state.snake.length - 1
      ),
    ];
    newState.status = this.getNewGameStatus(newState.snake, newState.status);
    if (ateFruit) {
      newState.fruit = this.getNewFruit(newState.snake);
    }
    this.setState(newState);
  }

  getNewFruit(snake: [number, number][]) {
    var newFruit: [number, number];
    do {
      newFruit = [
        Math.floor(Math.random() * SIDE),
        Math.floor(Math.random() * SIDE),
      ];
    } while (snake.find((p) => p[0] === newFruit[0] && p[1] === newFruit[1]));
    return newFruit;
  }

  getNewHead(key: GameState, head: [number, number]): [number, number] {
    switch (key) {
      case GameState.Left:
        return [head[0], head[1] - 1];
      case GameState.Right:
        return [head[0], head[1] + 1];
      case GameState.Up:
        return [head[0] - 1, head[1]];
      case GameState.Down:
        return [head[0] + 1, head[1]];
      default:
        return head;
    }
  }

  getNewGameStatus(snake: [number, number][], status: GameState) {
    if (snake.length === SIDE * SIDE) {
      return GameState.Won;
    }
    const head = snake[0];
    if (
      head[0] === -1 ||
      head[0] === SIDE ||
      head[1] === -1 ||
      head[1] === SIDE ||
      snake
        .slice(1, snake.length)
        .find((p) => p[0] === head[0] && p[1] === head[1])
    ) {
      return GameState.Lost;
    }
    return status;
  }

  buttonToState(e: KeyboardEvent, status: GameState): GameState {
    if ([GameState.Won, GameState.Lost].includes(this.state.status)) {
      if (e.key === "Enter") {
        return GameState.Start;
      } else {
        return status;
      }
    } else if (e.key === "ArrowLeft" && status !== GameState.Right) {
      return GameState.Left;
    } else if (e.key === "ArrowRight" && status !== GameState.Left) {
      return GameState.Right;
    } else if (e.key === "ArrowUp" && status !== GameState.Down) {
      return GameState.Up;
    } else if (e.key === "ArrowDown" && status !== GameState.Up) {
      return GameState.Down;
    } else {
      return status;
    }
  }

  getBaseState(): AppState {
    const snake: [number, number][] = [
      //[SIDE - 5, SIDE / 2],
      //[SIDE - 4, SIDE / 2],
      //[SIDE - 3, SIDE / 2],
      //[SIDE - 2, SIDE / 2],
      [SIDE - 1, SIDE / 2],
    ];
    return {
      fruit: this.getNewFruit(snake),
      status: GameState.Start,
      snake,
    };
  }

  render(): React.ReactNode {
    var statusBar: React.ReactNode;
    if (this.state.status === GameState.Start) {
      statusBar = <div className={styles.statusBar}>Use arrow keys.</div>;
    } else if (this.state.status === GameState.Won) {
      statusBar = (
        <div className={styles.statusBar}>
          You won!
          <br />
          Press Enter to restart.
        </div>
      );
    } else if (this.state.status === GameState.Lost) {
      statusBar = (
        <div className={styles.statusBar}>
          You lost!
          <br />
          Press Enter to restart.
        </div>
      );
    } else {
      statusBar = (
        <div className={styles.statusBar}>
          Score: {this.state.snake.length - 1}
        </div>
      );
    }
    return (
      <div className={styles.app}>
        <Board
          side={SIDE}
          snake={this.state.snake}
          fruit={this.state.fruit}
          status={this.state.status}
        />
        {statusBar}
      </div>
    );
  }
}
