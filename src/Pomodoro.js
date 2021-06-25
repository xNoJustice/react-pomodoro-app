import React, { Component } from "react";
import logo from "./logo.svg";
import "./logo.css";
import alarm from "./alarm.mp3";
import alarm2 from "./alarm2.mp3";

export default class Pomodoro extends Component {
  state = {
    time: 1800,
    interval: null,
    running: false,
    cycle: true,
    sessionCount: 1,
    sessionTime: 30,
    sessionLength: 30 * 60,
    breakTime: 5,
    breakLength: 5 * 60,
  };

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  tick = () => {
    const { cycle, time, breakLength, sessionLength, sessionCount, interval } =
      this.state;
    if (time < 1) {
      clearInterval(interval);
      let audio = new Audio(cycle ? alarm : alarm2);
      audio.play().catch((error) => {
        console.log(error);
      });
      setTimeout(() => audio.pause(), 1400);
      this.setState({
        cycle: !cycle,
        time: cycle ? breakLength : sessionLength,
        sessionCount: cycle ? sessionCount : sessionCount + 1,
      });
      this.startTimer();
    }
    this.setState((state) => ({ time: state.time - 1 }));
  };

  stopInterval = () => {
    clearInterval(this.state.interval);
    this.setState({ interval: null });
  };

  start = () => {
    this.setState({
      time: this.state.cycle
        ? this.state.sessionLength
        : this.state.breakLength,
    });
    this.startTimer();
  };

  startTimer = () => {
    this.setState({
      running: true,
      interval: setInterval(this.tick, 1000),
      time: this.state.time,
    });
  };

  resetTimer = (time) => {
    this.stopInterval();
    this.setState({
      time: time ? time : this.state.sessionTime * 60,
      running: false,
      sessionCount: 1,
    });
  };

  pauseTimer = () => {
    this.state.interval ? this.stopInterval() : this.startTimer();
  };

  getStatus = () => {
    const { running, interval } = this.state;
    if (running && !interval) return "Paused";
    if (running) return "Running";
  };

  formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      seconds > 9 ? seconds : `0${seconds}`
    }`;
  }

  updateSession(number) {
    let num = Number(number);
    num = num > 99 ? 99 : num < 1 ? 1 : num;
    this.setState({
      sessionLength: num * 60,
      sessionTime: num,
    });
    this.resetTimer(num * 60);
  }

  updateBreak(number) {
    let num = Number(number);
    num = num > 99 ? 99 : num < 1 ? 1 : num;
    this.setState({
      breakLength: num * 60,
      breakTime: num,
    });
    this.resetTimer(num * 60);
  }

  render() {
    document.title = `(${this.formatTime(this.state.time)}) Pomodoro`;

    const status = this.getStatus();
    return (
      <div className="w-full h-screen mx-auto p-6 flex justify-center items-center flex-col">
        <img src={logo} className="logo mx-auto" alt="logo" />
        <div className="w-80 h-80 mt-3 font-bold text-gray-300 rounded-full border-4 border-red-700 bg-purple-600 flex items-center justify-center font-mono">
          <span className="text-2xl text-center block py-2 ml-1">
            <span className="block">
              {this.state.cycle
                ? `Session ${this.state.sessionCount}`
                : `Break time!`}
            </span>
            <span className="block">{status !== "Running" && status}</span>
            <span className="block">{this.formatTime(this.state.time)}</span>
            {!status && (
              <button
                className="py-2 px-4 mx-2 mt-3 w-40 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                onClick={() => this.start()}
              >
                Start Timer ⏩
              </button>
            )}
            {(status === "Paused" || status === "Running") && (
              <div>
                <button
                  className="py-2 px-4 mx-2 mt-3 w-40 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                  onClick={() => this.resetTimer()}
                >
                  Reset 🔄
                </button>
                <button
                  className="py-2 px-4 mx-2 mt-3 w-40 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                  onClick={() => this.pauseTimer()}
                >
                  {status === "Paused" ? "Resume ⏳" : "Pause 🚧"}
                </button>
              </div>
            )}
          </span>
        </div>
        <div className="text-center dark:text-gray-50 mt-5"></div>
        <div className="flex justify-center items-center dark:text-gray-50 mt-5">
          <div className="flex flex-col justify-center items-center mr-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onChange={() => this.updateSession(this.state.sessionTime + 1)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 11l7-7 7 7M5 19l7-7 7 7"
              />
            </svg>
            <span className="text-xl py-2">Session Time</span>
            <div className="mb-3 space-y-2 text-xs">
              <input
                className="appearance-none text-center block w-24 text-xl bg-grey-lighter text-gray-700 rounded-lg h-10 px-4 focus:outline-none"
                type="number"
                id="session"
                value={this.state.sessionTime}
                onChange={(e) => this.updateSession(e.target.value)}
              />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onChange={() => this.updateSession(this.state.sessionTime - 1)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => this.updateBreak(this.state.breakTime + 1)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 11l7-7 7 7M5 19l7-7 7 7"
              />
            </svg>
            <span className="text-xl py-2">Break Time</span>
            <div className="mb-3 space-y-2 text-xs">
              <input
                className="appearance-none text-center block w-24 text-xl bg-grey-lighter text-gray-700 rounded-lg h-10 px-4 focus:outline-none"
                type="number"
                id="break"
                value={this.state.breakTime}
                onChange={(e) => this.updateBreak(e.target.value)}
              />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => this.updateBreak(this.state.breakTime - 1)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
