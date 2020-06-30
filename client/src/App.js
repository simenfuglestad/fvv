import React, { Component } from 'react';
import axios from 'axios';
import ApiGateway from './ApiGateway'
import Container from './components/Container'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nvdbEndpoint: 'https://nvdbapiles-v3.utv.atlas.vegvesen.no/',
      currentLocation: { lat: 60.0084857, lng:11.0648648 },
      menu: 'mainMenu',
      map: {},
      filters: [],
      roads: [],
      issues: [],
    }

    this.nvdb = new ApiGateway(this.state.nvdbEndpoint)


    //bind functions that need a reference to this instance
    this.handleFilters = this.handleFilters.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.setPoly = this.setPoly.bind(this);
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.getUserLocation)
    this.getRoadObjectTypes()
    //this.getIssues();
    //this.altTestApiSkriv();
  }

  componentDidUpdate(prevprops,prevstate){
    if(this.state.filters !== prevstate.filters || this.state.poly !== prevstate.poly){
      console.log('fetching data')
      this.fetchData();
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
    //TODO
  }

  fetchData(){
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


    if(filters){
      filters.forEach(async(element) => {
        this.nvdb.apiCall('vegobjekter/' + element + '?inkluder=alle&srid=4326&polygon=' + this.state.poly).then((value) => {
          this.setState((prevState) => {
            let newMap = {...prevState.map};
            newMap[element] = value;

            return {map: newMap};
          });
        });
      });
    }
  }


  handleFilters(filters) {
    this.setState({filters: filters})
  }

  async getRoadObjectTypes(){
    const data = await this.nvdb.apiCallSingle('vegobjekttyper')
    this.setState({roadObjectTypes: data})
  }

  async handleRegistration(issues){
    const response = await axios.post('/api/registerIssue', issues);

    if (response.status !== 200) throw Error(response);
  }

  async getIssues(){
    const response = await axios.get('/api/getIssues');
    this.setState({issues: response.data})
  }

  async testApiSkriv(){
    const response = await axios.post('http://localhost:8010/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser', {headers: { 'Content-Type': 'application/json'}, body: {'username': 'bjosor', 'password': 'bjosor'}});
    console.log(response)

  }

  altTestApiSkriv(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
      }
    };
    xhttp.open("POST", 'http://localhost:8010/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser', true);
    xhttp.setRequestHeader("Content-type", 'application/json');
    xhttp.send({'username': 'bjosor', 'password': 'bjosor'});
  }
}

export default App;
