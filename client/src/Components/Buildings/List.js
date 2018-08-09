import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class List extends Component {
  static propTypes = {
    properties: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      perPage: 10
    };

    // var firstItem = this.state.page
  }

  render() {
    return (
      <div>
        <p>Hello from List!</p>
      </div>
    );
  }
}

export default List;
