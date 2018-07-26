import React, { Component } from 'react';

// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Input from './Input';

class Form extends Component {
  render() {
    var headRoom = { marginTop: 50 };

    return (
      <div className="container">
        <div className="row justify-content-md-center" style={headRoom}>
          <div className="col col-md-9">
            <Input></Input>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
