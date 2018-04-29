import React, { Component } from 'react';

import { /*BrowserRouter as Router, Route, */Link } from "react-router-dom";

// import reqs from '../../requests';
import reqs from '../requests';

class Buildings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: ''
    };

    this.export = this.export.bind(this);
  }

  componentDidMount() {
    var address = this.props.match.params.address;
    reqs.get('/api/parcel', { address })
      .then(function (data) {
        console.log("then (Buildings)");
      })
      .catch(function (error) {
        this.setState({ error });
      }.bind(this));
  }

  export(event) {
    event.preventDefault();
    console.log("exporting data", this.state.data);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorDisplay error={this.state.error} />
      );
    }

    return (
      <div>
        <Header props={this.state} />
        <div className="container" style={{ minHeight: 800 }}>
          <div className="row justify-content-md-center">
            <div className="col col-md-6">
              <p style={{color: 'purple'}}>Hello</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Buildings;

class Header extends Component {
  render() {
    var props = this.props.props;
    var numBuildings = (props.data && props.data.numBuildings) || 0;

    return (
      <div className="bg-light">
        <pre>{JSON.stringify(this.props)}</pre>
        <div>
          <h5 className="padding-twenty float-left" style={{color: 'purple'}}>
            This landlord is associated with {numBuildings} buildings.
          </h5>
          <p className="padding-twenty float-right">
            <button type="button" className="btn btn-outline-dark ml-1" onClick={this.export} onTouchStart={this.export}>
              Export Data
            </button>
            <Link to="/">
              <button type="button" className="btn btn-outline-dark ml-1">
                New Search
              </button>
            </Link>
          </p>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}

class ErrorDisplay extends Component {
  render() {
    // var pD = function(e) { e.preventDefault(); };

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
