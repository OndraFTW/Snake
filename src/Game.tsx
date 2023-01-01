import React from "react";
import Board from "./Board";
import styles from "./App.module.scss";

export enum Direction {
  None,
  Left,
  Right,
  Up,
  Down,
}

export enum GameStatus {
  Start,
  Stop,
  Replay,
}

export interface GameState {
  round: number;
  score: number;
  won: boolean;
  replayStarted: boolean;
  snake: [number, number][];
  fruit: [number, number];
  fruitHistory: [number, number][];
  directionHistory: Direction[];
}

interface GameProps {
  side: number;
  tick: number;
  status: GameStatus;
  direction: Direction;
  finished: (gameState: GameState) => void;
}

export default class Game extends React.Component<GameProps, GameState> {
  interval?: NodeJS.Timer;
  firstFruit: [number, number];

  constructor(props: GameProps) {
    super(props);
    this.state = this.getBaseState();
    this.firstFruit = this.state.fruit;
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), this.props.tick);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.gameStep();
  }

  gameStep() {
    if (
      this.props.status === GameStatus.Start &&
      this.props.direction === Direction.None
    ) {
      this.setState(this.getBaseState());
      return;
    }
    if (this.props.status === GameStatus.Stop) {
      return;
    }
    const newState = { ...this.state };
    if (
      this.props.status === GameStatus.Replay &&
      this.props.direction === Direction.None &&
      !newState.replayStarted
    ) {
      newState.round = 0;
      newState.score = 0;
      newState.won = false;
      newState.replayStarted = true;
      newState.snake = [[this.props.side - 1, this.props.side / 2]];
      newState.fruit = newState.fruitHistory[0];
    }
    newState.round++;
    const newDirection =
      this.props.status === GameStatus.Replay
        ? newState.directionHistory[newState.round]
        : this.props.direction;
    const newHead = this.getNewHead(newDirection, newState.snake[0]);
    const ateFruit =
      newHead[0] === newState.fruit[0] && newHead[1] === newState.fruit[1];
    newState.snake = [
      newHead,
      ...newState.snake.slice(
        0,
        ateFruit ? newState.snake.length : newState.snake.length - 1
      ),
    ];
    if (this.props.status !== GameStatus.Replay) {
      newState.directionHistory = [
        ...newState.directionHistory,
        this.props.direction,
      ];
    }
    if (ateFruit) {
      newState.score++;
      if (this.props.status !== GameStatus.Replay) {
        newState.fruit = this.getNewFruit(newState.snake);
        newState.fruitHistory = [...newState.fruitHistory, newState.fruit];
      } else {
        newState.fruit = newState.fruitHistory[newState.score];
      }
    }
    var gameEnded = false;
    if (newState.snake.length === this.props.side * this.props.side) {
      newState.won = true;
      gameEnded = true;
      newState.replayStarted = false;
    } else if (
      newHead[0] === -1 ||
      newHead[0] === this.props.side ||
      newHead[1] === -1 ||
      newHead[1] === this.props.side ||
      newState.snake
        .slice(1, newState.snake.length)
        .find((p) => p[0] === newHead[0] && p[1] === newHead[1])
    ) {
      newState.won = false;
      gameEnded = true;
      newState.replayStarted = false;
    }
    this.setState(newState);
    if (gameEnded) {
      this.props.finished(newState);
    }
  }

  getNewFruit(snake: [number, number][]) {
    var newFruit: [number, number];
    do {
      newFruit = [
        Math.floor(Math.random() * this.props.side),
        Math.floor(Math.random() * this.props.side),
      ];
    } while (snake.find((p) => p[0] === newFruit[0] && p[1] === newFruit[1]));
    return newFruit;
  }

  getNewHead(direction: Direction, head: [number, number]): [number, number] {
    switch (direction) {
      case Direction.Left:
        return [head[0], head[1] - 1];
      case Direction.Right:
        return [head[0], head[1] + 1];
      case Direction.Up:
        return [head[0] - 1, head[1]];
      case Direction.Down:
        return [head[0] + 1, head[1]];
      default:
        return head;
    }
  }

  getBaseState(): GameState {
    const snake: [number, number][] = [
      [this.props.side - 1, this.props.side / 2],
    ];
    const fruit = this.firstFruit ? this.firstFruit : this.getNewFruit(snake);
    return {
      round: 0,
      score: 0,
      fruit,
      won: false,
      replayStarted: false,
      fruitHistory: [fruit],
      directionHistory: [Direction.None],
      snake,
    };
  }

  render(): React.ReactNode {
    return (
      <div className={styles.game}>
        <Board
          side={this.props.side}
          snake={this.state.snake}
          fruit={this.state.fruit}
        />
      </div>
    );
  }
}
