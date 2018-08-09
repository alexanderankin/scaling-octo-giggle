import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function avgArrs(arrs) {
  return arrs.reduce(function (counter, next, index, arraysArray) {
    next.forEach(function(value, arrIndex) {
      counter[arrIndex] += value / arraysArray.length;
    });
    return counter;
  }, [0, 0]);
}

class Map extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentLocation: null
    };
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // if there are no results yet, try to update
  //   if (!(this.props.data && this.props.data.results)) { return true; }

  //   var sameData = this.props.data === nextProps.data;

  //   // component should update if there is different data
  //   return !sameData;
  // }

  componentWillUnmount() {
    window.mymap = null;
  }

  componentDidUpdate(prevProps, prevState) {
    var results = (this.props.data && this.props.data.results) || false;
    if (!results) return;

    if (window.mymap) { console.log("returning"); return; }

    var L = window.L;
    var center = [ 40.43349025536598, -79.9543333053589 ];
    var mymap = L.map('map');
    mymap.setView(center, 14);
    window.mymap = mymap;

    var locations = results.res;

    locations.forEach(function formatAddress(loc) {
      loc.address = [
        loc['HOUSENUM'], loc['FRACTION'], loc['ADDRESS'], loc['CITY'],
        loc['STATE'], loc['UNIT'], loc['ZIP']
      ].join(' ');
    });

    Promise.all(locations.map(function (location) {
      return window.fetch('https://nominatim.openstreetmap.org/search/' + encodeURIComponent(location.address) + '?format=json')
        .then(result => result.json())
        .then(body => {
          return { location, geo: body[0] };
        });
    }))
      .then(function (locations) {
        var points = [];

        locations.forEach(function (location) {
          var coords = [ location.geo.lat,  location.geo.lon ];
          points.push(coords);

          var that = this;
          L.marker(coords, { location })
            .addTo(mymap)
            .on('click', function() {
              that.setState({ currentLocation: this.options.location });
            });
        }.bind(this));

        console.log("done adding points");

        mymap.setView(avgArrs(points), 12.5);

        var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});

        mymap.addLayer(osm);
        console.log("done adding map layer");
      }.bind(this))
      .catch(error => {
        throw error;
        // console.error(error);
      })
  }

  render() {
    var selectNone = () => this.setState({ currentLocation: null });
    return (
      <div className="row" style={{ margin: 'auto 0' }}>
        <div className="col-sm-6" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div id="map" style={{ height: 400 }}></div>
        </div>
        <div className="col-sm-6" style={{ paddingLeft: 0, paddingRight: 0 }}>
          {this.state.currentLocation
            ? <Location location={this.state.currentLocation} none={selectNone} />
            : <p>None Selected</p>}
        </div>
      </div>
    );
  }
}

export default Map;

class Location extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    none: PropTypes.func.isRequired
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return <div>
      <p>{this.props.location.geo.display_name}</p>
      <code>{JSON.stringify(this.props.location, null, 2)}</code>
      <button type="button" onClick={this.props.none} className="btn btn-default">Cancel</button>
    </div>
  }
}
