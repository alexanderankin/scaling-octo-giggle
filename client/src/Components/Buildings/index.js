import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './react-tabs-custom.css';

import reqs from '../../requests';

import Header from './Header';
import ErrorDisplay from './ErrorDisplay';

import Map from './Map';
import List from './List';
import Summary from './Summary';

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
    var landlord_id = this.props.match.params.id;
    reqs.get('/api/landlord', { landlord_id })
      .then(function (data) {
        this.setState({ data });
      }.bind(this))
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

    var data = this.state.data;
    var numBuildings = (data.results && data.results.total) || 0;

        // <div className="container" style={{ minHeight: 800 }}>
        //   <div className="row justify-content-md-center">
        //     <div className="col col-md-6">
        //       <p style={{color: 'purple'}}>Hello</p>
        //     </div></div>
        // </div>


    return (
      <div>
        <Header data={{ numBuildings }} />
        {this.state.data.results
          ? <Tabs defaultIndex={1} >
              <TabList>
                <Tab>Map</Tab>
                <Tab>List</Tab>
                <Tab>Summary</Tab>
              </TabList>

              <TabPanel>
                <Map     data={data} />
              </TabPanel>
              <TabPanel>
                <List   selected={true} data={data} />
              </TabPanel>
              <TabPanel>
                <Summary data={data} />
              </TabPanel>
            </Tabs>
          : null}
      </div>
    );
  }
}

export default Buildings;
