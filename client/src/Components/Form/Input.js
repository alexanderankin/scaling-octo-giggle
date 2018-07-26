import React, { Component } from 'react';
import PropTypes from 'prop-types';


// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from "react-router";
import _ from 'lodash';
// import $ from 'jquery';
// import Bloodhound from 'typeahead.js';

// import reqs from '../../requests';

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      PIN:          '',
      HOUSENUM:     '',
      FRACTION:     '',
      ADDRESS:      '',
      CITY:         '',
      STATE:        '',
      UNIT:         '',
      ZIP:          '',
      addressSoFar: '',
      suggestions: [],
      error: '',
      success: false,
    };

    this.suggestions = _.debounce(this.suggestions, 300).bind(this);
  }

  suggestions() {
    window.fetch('/api/address/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        this.progress = false;
        return response.json();
      })
      .then(body => {
        this.setState({ suggestions: body.suggestions });
      })
      .catch(e => {
      console.log(this.state);
      this.setState({ error: (e + '') });
    });
  }

  submitAction = (event) => {
    event.preventDefault();
    if (this.state.suggestions && this.state.suggestions > 0) {
      console.log('Using suggestion', this.state.suggestions[0]);
    }
    // var that = this;
    /*
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
  */}

  inputChange = (event) => {
    event.preventDefault();
    var o = {}; o[event.target.dataset.field] = event.target.value;
    this.setState(o, function() { this.suggestions(); });
  }

  render() {
    if (this.state.success) {
      // return <p>Sending to page with address {this.state.addressSoFar}.</p>
      return <Redirect to={'/parcel/' + this.state.addressSoFar} />
    }

    return (
      <div>
        <p>
          Enter an address and find other buildings your landlord might own:
        </p>
        <form onSubmit={this.submitAction}>
          <div className="form-group row justify-content-md-center">
            <FormGroup type="text" desc="PIN"      width={2} onChange={this.inputChange} value={this.state.PIN} />
            <FormGroup type="text" desc="HOUSENUM" width={1} onChange={this.inputChange} value={this.state.HOUSENUM} />
            <FormGroup type="text" desc="FRACTION" width={1} onChange={this.inputChange} value={this.state.FRACTION} />
            <FormGroup type="text" desc="ADDRESS"  width={4} onChange={this.inputChange} value={this.state.ADDRESS} />
            <FormGroup type="text" desc="CITY"     width={1} onChange={this.inputChange} value={this.state.CITY} />
            <FormGroup type="text" desc="STATE"    width={1} onChange={this.inputChange} value={this.state.STATE} />
            <FormGroup type="text" desc="UNIT"     width={1} onChange={this.inputChange} value={this.state.UNIT} />
            <FormGroup type="text" desc="ZIP"      width={1} onChange={this.inputChange} value={this.state.ZIP} />
          </div>
        </form>
        <ul>
          {this.state.suggestions.map(suggestion => {
            return <li key={suggestion.id}>
              <code>{JSON.stringify(suggestion)}</code>
            </li>;
          })}
        </ul>
        {this.state.error
          ? <p>There was an error: {this.state.error}</p>
          : null}
      </div>
    );
  }
}

export default Input;

const FULLTEXT = {
  PIN: 'PIN (Property Identification Number)',
  HOUSENUM: '###',
  FRACTION: '1/2',
  ADDRESS: 'Street Address',
  CITY: 'City',
  STATE: 'State',
  UNIT: 'Unit No',
  ZIP: 'Zip Code',
};

class FormGroup extends Component {
  render() {
    return <div className={"col-md-" + this.props.width} style={{ paddingLeft: 0, paddingRight: 0 }}>
      <input
        className="form-control form-control-sm"
        type={this.props.type} 
        placeholder={FULLTEXT[this.props.desc] || ''}
        title={FULLTEXT[this.props.desc] || ''}
        data-field={this.props.desc}
        aria-label={'Enter the ' + this.props.desc + ' here.'}
        aria-required="false"
        onChange={this.props.onChange}
        value={this.props.value}
      />
      </div>;
  }
}

FormGroup.propTypes = {
  type: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
