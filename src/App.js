import React, { Component } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import Menu from './components/Menu';
import MapFilter from './components/MapFilter';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: { lat: 60.0084857, lng:11.0648648 },
      menu: [],
      map: [],
    }

    //bind functions that need a reference to this instance
    this.handleFilters = this.handleFilters.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.getNearbyData = this.getNearbyData.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Menu 
          data={this.state.menu}
          getNearbyData={this.getNearbyData}
        />
        <MapView
          currentLocation={this.state.currentLocation}
          data={this.state.map}
        />
        <MapFilter
          data={this.state.menu}
          handleFilters={this.handleFilters}
        />

      </div>
    );
  }

  getPolygon(center){
    return(
      [{lat: center.lat-0.1, lng: center.lng}, 
      {lat: center.lat, lng: center.lng-0.1},
      {lat: center.lat+0.1, lng: center.lng},
      {lat: center.lat, lng: center.lng+0.1}]
      );
  }

  getPolygonString(center){
    return(
      '' + (center.lat-0.1) + ' ' +
      center.lng + ',' +
      center.lat + ' ' +
      (center.lng-0.1) + ',' +
      (center.lat+0.1) + ' ' +
      center.lng + ',' +
      center.lat + ' ' +
      (center.lng+0.1) + ',' +
      (center.lat-0.1) + ' ' +
      center.lng
    );
  }

  async getNearbyData(){
    const poly = this.getPolygonString(this.state.currentLocation)
    console.log(poly)
    const res = await axios.get('https://nvdbapiles-v3.utv.atlas.vegvesen.no/vegobjekter/79?inkluder=alle&srid=4326&polygon=' + poly  , {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}})
  
        const data = res.data;
        console.log(data);
        this.setState({map: data});
  }

  async componentDidMount() {
    /*
    const res = await axios.get('https://nvdbapiles-v3.utv.atlas.vegvesen.no/omrader/kommuner', {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}})

    const data = res.data;
    this.setState({menu: data});
    */

    //navigator.geolocation.getCurrentPosition(this.getUserLocation)
  }

  getUserLocation(position){
    this.setState({currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}})
  }

  async handleFilters(kommune) {
    let kommuner = '';
    kommune.forEach(element => {
      kommuner += element.nummer + ',';
    });
    if(kommuner){
      try {
        const res = await axios.get('https://nvdbapiles-v3.utv.atlas.vegvesen.no/vegobjekter/79?inkluder=alle&srid=4326&antall=10000&kommune=' + kommuner, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}})
  
        const data = res.data;
        console.log(data);
        this.setState({map: data});
      } catch(error) {
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }
    } else {
      this.setState({map: []})
    }
  }  
}

export default App;
