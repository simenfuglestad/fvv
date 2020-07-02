import React, { Component } from 'react';
import ServerConnection from './ServerConnection'
import Container from './components/Container'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nvdbEndpoint: 'https://nvdbapiles-v3.atlas.vegvesen.no/',
      currentLocation: { lat: 60.0084857, lng:11.0648648 },
      menu: 'mainMenu',
      map: {},
      filters: [],
      roads: [],
      issues: [],
    }

    this.server = new ServerConnection()


    //bind functions that need a reference to this instance
    this.handleFilters = this.handleFilters.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.setPoly = this.setPoly.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.getUserLocation)
    this.getRoadObjectTypeData()
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.filters !== prevState.filters || this.state.poly !== prevState.poly){
      //if a filter has been removed
      if(this.state.filters.length < prevState.filters.length) {
        this.removeData();
      }

      // if a filter has been added or the polygon state has changed
      if(this.state.filters.length > prevState.filters.length){
        this.state.filters.forEach(filter => {
          let current = this.state.map[filter.id];
          let prev = prevState.map[filter.id];
            if(current !== prev || (current === undefined && prev === undefined )){
              console.log('fetching data')
              this.fetchData(filter);
            }
        })
      }

      if(this.state.poly !== prevState.poly){
        this.state.filters.forEach(filter => {
        this.fetchData(filter);
        })
      }
    }
  }

  render() {

    return (
        <Container
          currentLocation={this.state.currentLocation}
          map= {this.state.map}
          filters= {this.state.filters}
          roads={this.state.roads}
          issues={this.state.issues}
          roadObjectTypes={this.state.roadObjectTypes}
          handleFilters={this.handleFilters}
          handleRegistration={this.handleRegistration}
          setPoly={this.setPoly}
        />
    );
  }

  getPolygonString(polygon) {
    let result = '';
    polygon.forEach(point => {
      result = result + point[0] + ' ' + point[1] + ',';
    });

    result = result + polygon[0][0] + ' ' + polygon[0][1]
    return result;
  }

  /**
   * Returns a collection of lat,lng points that form a circle around center
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
      points.push([ lat*(180/Math.PI), lng*(180/Math.PI)])
    });
    return points;
  }

  getUserLocation(position){
    this.setState({
      currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude},
      poly: this.getPolygonString(this.getCircle({lat: position.coords.latitude, lng: position.coords.longitude}))
    })
  }

  setPoly(polygon){
    if(polygon){
      polygon = this.getPolygonString(polygon)
      this.setState({poly: polygon})
    } else {
      navigator.geolocation.getCurrentPosition(this.getUserLocation)
    }
  }

  removeData(){
    let filters = this.state.filters.map(filter => (filter.id));
    let newDataSet = {};

    if(Object.entries(this.state.map).length > 0){
      Object.entries(this.state.map).forEach(([key, value]) => {
        if(filters.includes(Number(key))){
          newDataSet[key] = value;
        }
      })
      this.setState({map: newDataSet})
    }
  }

  fetchData(filter){
    let id = filter.id;
    
    this.server.apiCall('vegobjekter/' + id + '?inkluder=alle&srid=4326&polygon=' + this.state.poly).then((value) => {
      this.setState((prevState) => {
        let newMap = {...prevState.map};
        newMap[id] = value;

        return {map: newMap};
      });
    });
  }

  handleFilters(filters) {
    this.setState({filters: filters})
  }

  async getRoadObjectTypeData(){
    const data = await this.server.apiCallSingle('vegobjekttyper')

    data.forEach(type => {
      this.server.apiCallSingle('vegobjekttyper' + '/' + type.id)
    })
    this.setState({roadObjectTypes: data})
  }
}

export default App;
