import React, { Component } from 'react';
import axios from 'axios';
import ApiGateway from './ApiGateway'
import Container from './components/Container'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: { lat: 60.0084857, lng:11.0648648 },
      menu: 'mainMenu',
      map: [],
      filters: [],
      roads: [],
    }

    this.ApiGateway = new ApiGateway('https://nvdbapiles-v3.utv.atlas.vegvesen.no/')

    //bind functions that need a reference to this instance
    this.handleFilters = this.handleFilters.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.getUserLocation)
  }

  render() {
    return (
      <Container 
        currentLocation={this.state.currentLocation}
        map={this.state.map}
        filters={this.state.filters}
        roads={this.state.roads}
        handleFilters={this.handleFilters}
      />
    );
  }

  getPolygonString(polygon) {
    let result = '';
    polygon.forEach(point => {
      result = result + point.lat + ' ' + point.lng + ',';
    });
    return result.slice(0, -1);
  }

  /**
   * Returns a collection of lat,lng points that form a circle around center
   * @param {center point of circle in lat,lng} center 
   * @param {radius of circle in km} radius 
   * @param {how many points on the circle to return} verts 
   */
  getCircle(center, radius=5, verts=10){
    let headings = [];
    let low = 0;
    let step = (2*Math.PI - low) / verts;

    for (let index = 0; index < verts; index++) {
      headings.push(low);
      low += step;
    }

    radius = radius / 6371;
    center = {lat: center.lat*(Math.PI/180), lng: center.lng*(Math.PI/180)}
    let points = []

    headings.forEach(heading => {
      let lng;
      let lat = Math.asin(Math.sin(center.lat)*Math.cos(radius)+Math.cos(center.lat)*Math.sin(radius)*Math.cos(heading));

      if(Math.cos(lat) === 0){
        lng = center.lng;
      } else {
        lng = ((center.lng-Math.asin(Math.sin(heading)*Math.sin(radius)/Math.cos(lat))+Math.PI)%(2*Math.PI))-Math.PI;
      }
      points.push({lat: lat*(180/Math.PI), lng: lng*(180/Math.PI)})
    });

    points.push(points[0]);
    return points;
  }

  async apiCall(request){
    let res = await axios.get(request, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}});

    let data = res.data.objekter;

    while (res.data.metadata.returnert === 1000) {
      res = await axios.get(res.data.metadata.neste.href, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}});
      data = data.concat(res.data.objekter);
    }
    return data;
  }

  getUserLocation(position){
    this.setState({currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}})
  }

  async handleFilters(filters) {
    const poly = this.getPolygonString(this.getCircle(this.state.currentLocation))
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
