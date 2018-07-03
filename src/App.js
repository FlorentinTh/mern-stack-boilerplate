import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import logo from './img/logo.svg';
import './css/App.scss';

/* eslint "react/prefer-stateless-function": 0 */
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to React
          </h1>
        </header>
        <p className="App-intro">
          To get started, edit
          <code>
            src/App.js
          </code>
          and save to reload.
        </p>
      </div>
    );
  }
}

export default hot(module)(App);
