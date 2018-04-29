import React, { Component } from 'react';

// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from "react-router";
import _ from 'lodash';
// import $ from 'jquery';
// import Bloodhound from 'typeahead.js';

import reqs from '../../requests';

const MINIMUM_LENGTH = 4;

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressSoFar: '',
      suggestions: [],
      error: '',
      loading: false,
      success: false,
    };

    this.suggestions = _.debounce(this.suggestions, 100).bind(this);
  }

  suggestions() {
    var address = this.state.addressSoFar;
    if (address.length < MINIMUM_LENGTH) { return; }

    var that = this;
    var body = { address };

    reqs.get('/api/suggestions', body)
      .then(function (res) {
        that.setState({ error: '', suggestions: res.suggestions });
      })
      .catch(function (error) {
        that.setState({ error: error.message });
      });
  }

  submitAction = (event) => {
    var that = this;
    event.preventDefault();
    // console.log("submitAction");
    this.setState({ loading: true }, function () {
      reqs.get('/api/address/exist', { address: this.state.addressSoFar })
        .then(function (res) {
          if (res.exists) {
            that.setState({ success: true });
          }

          else {
            that.setState({ loading: false, error: 'This address not found.' });
          }
        })
        .catch(function (error) {
          that.setState({ loading: false, error: error + '' });
        });
    })
  }

  inputChange = (event) => {
    event.preventDefault();
    this.setState({ addressSoFar: event.target.value }, function() {
      this.suggestions();
    });
  }

  render() {
    if (this.state.success) {
      // return <p>Sending to page with address {this.state.addressSoFar}.</p>
      return <Redirect to={'/parcel/' + this.state.addressSoFar} />
    }

    var asf = this.state.addressSoFar;

    return (
      <div>
        <p>
          Enter an address and find other buildings your landlord might own:
        </p>
        <form onSubmit={this.submitAction}>
          <div className="form-group">
            <input
              disabled={this.state.loading}
              className="form-control address-suggested"
              type="text" 
              aria-label={"Enter address of a building in Pittsburgh here."}
              aria-required="true"
              onChange={this.inputChange}
              value={this.state.addressSoFar}
              name="address-input"
              list="address-suggestions"
            />
            <datalist id="address-suggestions">
              {this.state.suggestions.map(function (s) {
                return <option value={s.value + ''} key={s.id}>{asf}</option>
              })}
            </datalist>
            {this.state.loading
              ? <div className="loader">Loading...</div>
              : null}
          </div>
        </form>
        {this.state.suggestions.length === 0 && asf.length >= MINIMUM_LENGTH
          ? <p>This address is not found.</p>
          : null}
        {this.state.error
          ? <p>There was an error: {this.state.error}</p>
          : null}
      </div>
    );
  }
}

export default Input;
