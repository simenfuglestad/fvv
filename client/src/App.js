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
      map: [],
      filters: [],
      roads: [],
      issues: [],
      filterOnRoad: false,
    }

    this.nvdb = new ApiGateway(this.state.nvdbEndpoint)


    //bind functions that need a reference to this instance
    this.handleFilters = this.handleFilters.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.testRoadSelect = this.testRoadSelect.bind(this);
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.getUserLocation)
    this.getIssues();
    this.testApiSkriv();
  }

  render() {
    return (
      <Container 
        currentLocation={this.state.currentLocation}
        map= {this.state.map}
        filters= {this.state.filters}
        roads={this.state.roads}
        issues={this.state.issues}
        handleFilters={this.handleFilters}
        handleRegistration={this.handleRegistration}
        testRoadSelect={this.testRoadSelect}
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

  getUserLocation(position){
    this.setState({currentLocation: {lat: position.coords.latitude, lng: position.coords.longitude}})
  }

  //TODO
  async handleFilters(filters) {
    let promises = [];
    this.setState({filters: filters})

    if(this.state.filterOnRoad){
      const roadId = this.state.filterOnRoad;
      console.log(roadId);
      if(filters){
        filters.forEach(async(element) => {
          promises.push(this.nvdb.apiCall('vegobjekter/' + element + '?inkluder=alle&srid=4326&veglenkesekvens=' + roadId));
        });
        Promise.all(promises).then((values) => {
          this.setState({map: [].concat.apply([], values)});
        });
      }
    } else {
      const poly = this.getPolygonString(this.getCircle(this.state.currentLocation))

      if(filters){
        filters.forEach(async(element) => {
          promises.push(this.nvdb.apiCall('vegobjekter/' + element + '?inkluder=alle&srid=4326&polygon=' + poly));
        });
        Promise.all(promises).then((values) => {
          this.setState({map: [].concat.apply([], values)});
        });
      }
    }
  }
  
  async handleRegistration(issues){
    const response = await axios.post('/api/registerIssue', issues);

    if (response.status !== 200) throw Error(response);
  }

  async getIssues(){
    const response = await axios.get('/api/getIssues');
    this.setState({issues: response.data})
  }

  async testRoadSelect(lat, lng) {
    axios.get(this.state.nvdbEndpoint + 'posisjon?lat=' + lat + '&lon=' + lng + '&srid=4326' + '&maks_avstand=200').then(value => {
      axios.get(this.state.nvdbEndpoint + 'vegnett/veglenkesekvenser/' + value.data[0].veglenkesekvens.veglenkesekvensid + '?srid=4326').then(value2 => {
        this.setState({
          roads: value2.data.veglenker,
          filterOnRoad: value.data[0].veglenkesekvens.veglenkesekvensid
        })
      })
    })
  }

  async testApiSkriv(){
    const response = await axios.post('http://localhost:8010/ws/no/vegvesen/ikt/sikkerhet/aaa/autentiser', {'username': 'bjosor', 'password': 'bjosor'}, {headers: { 'Content-Type': 'application/json'}});
    console.log(response)
    
  }
}

export default App;
