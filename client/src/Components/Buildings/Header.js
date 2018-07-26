import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

class Header extends Component {
  static propTypes = {
    data: PropTypes.shape({
      numBuildings: PropTypes.number.isRequired,
    }).isRequired
  };

  render() {
    var data = this.props.data;
    var numBuildings = (data && data.numBuildings) || 0;

    return (
      <div className="bg-light">
        <div>
          <h5 className="padding-twenty float-left" style={{ color: 'purple', margin: 0, paddingTop: 23, paddingBottom: 23 }}>
            This landlord is associated with {numBuildings} buildings.
          </h5>
          <p className="float-right" style={{ margin: 0, padding: 16 }}>
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

export default Header;
