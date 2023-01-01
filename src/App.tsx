import React from "react";
import Game, { GameStatus } from "./Game";

interface AppProps {}

interface AppState {
  side: number;
  tick: number;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = this.getBaseState();
  }

  getBaseState(): AppState {
    return {
      side: 16,
      tick: 400,
    };
  }

  render() {
    return <Game side={this.state.side} tick={this.state.tick} />;
  }
}
