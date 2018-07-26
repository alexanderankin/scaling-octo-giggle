import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

class ErrorDisplay extends Component {
  render() {
    return (
      <div className="container">
        <div className="row justify-content-md-center padding-twenty">
          <div className="col col-md-6">
            <div className="card">
              <div className="card-header text-secondary">
                Error
              </div>
              <div className="card-body">
                <h5 className="card-title text-danger">No results found for .</h5>
                <p className="card-text text-danger">{this.props.error + ''}</p>
                <pre>{JSON.stringify(this.context)}</pre>
                <Link to="/">
                  <button type="button" className="btn btn-warning">
                    Search for a different address
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorDisplay;
