import React, { Component } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import Menu from './components/Menu';
import MapFilter from './components/MapFilter';
import ApiGateway from './ApiGateway'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: { lat: 60.0084857, lng:11.0648648 },
      menu: [],
      map: [],
      filters: [],
      roads: [],
    }

    this.ApiGateway = new ApiGateway('https://nvdbapiles-v3.utv.atlas.vegvesen.no/')

    //bind functions that need a reference to this instance
    this.handleFilters = this.handleFilters.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Menu 
          data={this.state.menu}
        />
        <MapView
          currentLocation={this.state.currentLocation}
          data={this.state.map}
          filters={this.state.filters}
          roads={this.state.roads}
        />
        <MapFilter
          data={this.state.menu}
          handleFilters={this.handleFilters}
        />

      </div>
    );
  }

  //ISSUE: longitude gets squished
  getPolygonString(center, offset=0.02){
    return(
      '' + (center.lat-offset) + ' ' +
      center.lng + ',' +
      center.lat + ' ' +
      (center.lng-offset) + ',' +
      (center.lat+offset) + ' ' +
      center.lng + ',' +
      center.lat + ' ' +
      (center.lng+offset) + ',' +
      (center.lat-offset) + ' ' +
      center.lng
    );
  }

  //ISSUE: does not work when response contains more than 1000 objects
  async apiCall(request){
    let res = await axios.get(request, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}});

    let data = res.data.objekter;

    while (res.data.metadata.returnert === 1000) {
      res = await axios.get(res.data.metadata.neste.href, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}});
      data = data.concat(res.data.objekter);
    }
    return data;
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.getUserLocation)
  }

  getUserLocation(position){
    this.setState({currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}})
  }

  async handleFilters(filters) {
    const poly = this.getPolygonString(this.state.currentLocation)
    let promises = [];
    this.setState({filters: filters})

    if(filters){
      filters.forEach(async(element) => {
        promises.push(this.apiCall('https://nvdbapiles-v3.utv.atlas.vegvesen.no/vegobjekter/' + element + '?inkluder=alle&srid=4326&polygon=' + poly));
      });
      Promise.all(promises).then((values) => {
        this.setState({map: [].concat.apply([], values)});
      });
    }
  }  

}

export default App;
