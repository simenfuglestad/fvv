import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Map, TileLayer, Marker, Popup, Polyline, Polygon} from 'react-leaflet';
import { PieChart } from 'react-minimal-pie-chart';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PolygonDrawer from './PolygonDrawer';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import Leaflet from 'leaflet';

/**
 * props:
 * data: map, roads, issues, filters
 * currentLocation
 * onClick
 */
class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 15,
      contextMenu: false,
      markers: {},
      polygonPoints: [],
      finished: false,
    }
    this.colorScheme = ['#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#ffff99','#cab2d6','#fdbf6f','#fb9a99','#b2df8a','#a6cee3']

    this.handleClick = this.handleClick.bind(this);
    this.getMarkerClusterIcon = this.getMarkerClusterIcon.bind(this);
    this.handleMovePoint = this.handleMovePoint.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    if(!this.compareData(nextState.markers, this.state.markers)) return(true);
    if(!this.compareData(nextProps.currentLocation, this.props.currentLocation)) return(true);

    if(nextProps.drawing !== this.props.drawing) return(true);

    if(!this.compareData(nextProps.map, this.props.map)){
      console.log('cake')
      let markers = {};
      this.props.filters.forEach((filter) => {
        if( JSON.stringify(this.props.map[filter.id]) !== JSON.stringify(nextProps.map[filter.id])){
          markers[filter.id] = this.drawMapObjects(nextProps.map[filter.id]);
        } else {
          markers[filter.id] = this.state.markers[filter.id]
        }
      });

      this.setState({markers: markers})
    } 

    return false;
  }

  componentDidUpdate(prevProps){
    if(prevProps.drawing !== this.props.drawing){
      this.setState({polygonPoints: [], finished: false})
    }

    console.log(prevProps.map)
    console.log(this.props.map)
    if(!this.compareData(prevProps.map, this.props.map)){
    }
  }

  render() {
    console.log('render')
    return (
      <Map 
        center={this.props.currentLocation} 
        zoom={this.state.zoom} maxZoom={19}
        onclick={this.handleClick}
      >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          <PolygonDrawer polygon={this.state.polygonPoints} finished={this.state.finished} handleMovePoint={this.handleMovePoint}/>

          {this.drawIssueMarkers(this.props.issues)}
          

          <MarkerClusterGroup spiderfyOnMaxZoom={false} disableClusteringAtZoom={18} iconCreateFunction={this.getMarkerClusterIcon}>
           {this.props.filters.length !== 0 && this.showMarkers()}
           {this.drawRoads(this.props.roads)}
          </MarkerClusterGroup>

        </Map>
    );
  }

  drawIssueMarkers(issueMarkers){
    return (
      issueMarkers.map((item,index) => {
        return(
          <Marker position={item.geometry.coordinates} key={index} icon={this.getIcon()} >
            <Popup>{item.properties.name + ' ' + item.properties.date}</Popup>
          </Marker>
        )
      })
    );
  }

  showMarkers(){
    let markers = [];
    Object.entries(this.state.markers).forEach(([key,value]) => {
      markers = markers.concat(value);
    })
    return markers;
  }

  drawMapObjects(objects){
    if(!objects){
      return []
    }
    let parse = require('wellknown')

    return (objects.map((item, index) => {
      try{

        const geoJSON = parse(item.geometri.wkt);
        if(geoJSON.type === 'Point'){
          const point = [geoJSON['coordinates'][0], geoJSON['coordinates'][1]]
          return (
            <Marker position={point} key={item.id} icon={this.getIcon(item.metadata.type.id)} onClick={() => {this.props.handleMarkerClick(item)}} >
            </Marker>
          );
        } else if(geoJSON.type === 'LineString') {
          let latLngList = Array.from(geoJSON.coordinates.map(coords => (coords.slice(0,2))));
          return (
            <Polyline color='red' positions= {latLngList} key={index}>
            </Polyline>
          );
        } else if(geoJSON.type === 'Polygon') {
          let latLngList = geoJSON.coordinates;
          return (
            <Polygon color='red' positions= {latLngList} key={index}>
            </Polygon>
          );
        } else {
          console.log('Invalid geoJSON: ' + geoJSON.type);
          console.log(geoJSON);
          return null;
        }

      } catch(err) {
          console.log(item);
          console.log(err)
          return null;
      }
     }));
  }

  drawRoads(objects){
    var parse = require('wellknown')
    return(
      objects.map((item,index) => {
        const geoJSON = parse(item.geometri.wkt)

        let latLngList = Array.from(geoJSON.coordinates.map(coords => (coords.slice(0,2))));
        return (
          <Polyline color='red' positions= {latLngList} key={index}>
              </Polyline>
        );
      })
    );
  }

  compareData(a,b){
    let bEmpty = true;
    let aEmpty = true;
    for(var i in b) { bEmpty = false; }
    for(var i in a) { aEmpty = false; } 

    if(aEmpty ? !bEmpty : bEmpty){
      return false;
    }
    
    let entriesA =  Object.entries(a);
    let entriesB =  Object.entries(b);
    let length = entriesA.length > entriesB.length ? entriesA.length : entriesB.length
    for (let index = 0; index < length; index++) {
      if(JSON.stringify(entriesA[index]) !== JSON.stringify(entriesB[index]) ) return false;
      
    }
    
    // if none are undefined then check for object equality
    return true;
  }

  getIcon(id){
    let color;
    let idIndex = this.props.filters.findIndex((filter) => (
      filter.id === id
    ))
    
    if(id){
      color = this.colorScheme[idIndex%this.colorScheme.length]
    } else {
      console.log('marker using default color')
      color = this.colorScheme[idIndex%this.colorScheme.length]
    }
 
    const markerHtmlStyles = `
    background-color: ${color};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`

    const icon = Leaflet.divIcon({
      className: id,
      iconAnchor: [0, 24],
      labelAnchor: [-6, 0],
      popupAnchor: [0, -36],
      html: `<span style="${markerHtmlStyles}" />`
    })

    return icon;
  }

  handleClick(event) {
    if(this.props.drawing && !this.state.finished){
      this.setState((prevstate) => ({
        polygonPoints: prevstate.polygonPoints.concat([[event.latlng.lat, event.latlng.lng]])
      }))
    } else {
      this.props.handleMapClick(event)
    }
  }

  handleMovePoint(){
    this.setState({finished: true})
    this.props.setPolyFilter(this.state.polygonPoints)
  }

  getMarkerClusterIcon(cluster){
    var children = cluster.getAllChildMarkers();
    var childCount = cluster.getChildCount();

    const clusterTypes = children.reduce(function (acc, curr) {
      const id = curr.options.icon.options.className;
      if (typeof acc[id] == 'undefined') {
        acc[id] = 1;
      } else {
        acc[id] += 1;
      }

      return acc;
    }, {});

    let data = this.props.filters.map((type, index) => { 
      if(clusterTypes[type.id]) {
        return ({
          title: type.id, 
          value: clusterTypes[type.id], 
          color: this.colorScheme[index%this.colorScheme.length],
          })
      } else {
        return;
      }
    })

    data = data.filter((item) => (item != null))


    const icon = Leaflet.divIcon({
      className: "my-custom-pin",
      iconSize: new Leaflet.Point(40, 40),
      html: ReactDOMServer.renderToString(
        <PieChart
          data={data}
          label={({ dataEntry }) => childCount}
          labelStyle={{
            fontSize: '40px',
            fontFamily: 'sans-serif',
            fill: 'white',
            textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
          }}
          labelPosition={0}
        /> 
      ) 
    })

		return icon;
  }
}

export default MapView;
