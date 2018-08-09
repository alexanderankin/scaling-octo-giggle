import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class List extends Component {
  static propTypes = {
    data: PropTypes.shape({
      results: PropTypes.shape({
        res: PropTypes.array.isRequired,
        total: PropTypes.number.isRequired
      }).isRequired
    }).isRequired
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
    var results = this.props.data.results;

    var start = 0 + ((this.state.page - 1) * this.state.perPage);
    var end = start + this.state.perPage;
    // console.log(start, end)
    var displayed = results.res.slice(start, end);
    return (
      <div>
        <p>Hello from List!</p>
        <button type="button" className="btn btn-default" style={{ margin: 5 }} onClick={() => this.setState({ page: this.state.page - 1 })} disabled={this.state.page === 1}>Prev</button>
        <button type="button" className="btn btn-default" style={{ margin: 5 }} onClick={() => this.setState({ page: this.state.page + 1 })} disabled={end > results.total}>Next</button>
        <br />
        <code>{JSON.stringify(Object.keys(results.res[0]))} </code>
        <table className="table table-hover">
          <thead>
            <tr>
              {/*<th></th>*/}
              <th>PIN</th>
              <th>HOUSENUM</th>
              <th>ADDRESS</th>
              <th>CITY</th>
              <th>STATE</th>
              <th>ZIP</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(function (property) {
              return <tr key={property['id']}>
                <td>{property['PIN']}</td>
                <td>{property['HOUSENUM']}</td>
                <td>{property['ADDRESS']}</td>
                <td>{property['CITY']}</td>
                <td>{property['STATE']}</td>
                <td>{property['ZIP']}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default List;
