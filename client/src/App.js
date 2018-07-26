import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route/*, Link*/ } from "react-router-dom";

import Components from './Components';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title text-left">Who owns what in pgh?</h1>
        </header>
        <Router>
          <div>
            <Route exact path="/"           component={Components.Form} />
            <Route path="/parcel/:address"  component={Components.Buildings} />
            <Route path="/topics"           component={Components.About} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
