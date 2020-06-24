import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Map, TileLayer, Marker, Popup, Polyline, Polygon, GeoJSON } from 'react-leaflet';
import { PieChart } from 'react-minimal-pie-chart';
import MarkerClusterGroup from 'react-leaflet-markercluster';
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
    }

    this.handleClick = this.handleClick.bind(this);
    this.getMarkerClusterIcon = this.getMarkerClusterIcon.bind(this);
  }

  render() {
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

          {this.drawIssueMarkers(this.props.issues)}

          <MarkerClusterGroup spiderfyOnMaxZoom={false} disableClusteringAtZoom={18} iconCreateFunction={this.getMarkerClusterIcon}>
           {this.props.filters.length !== 0 && this.drawMapObjects(this.props.map)}
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

  drawMapObjects(objects){
    var parse = require('wellknown')
    return(
      objects.map((item, index) => {
        try{

          const geoJSON = parse(item.geometri.wkt)
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
      })
    );
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

  getIcon(id){
    let color;
    
    if(id){
      color = this.rainbow(
        this.props.filters.length, 
        this.props.filters.findIndex((filter) => (
          filter.id === id
        ))
      );
    } else {
      color = this.rainbow(1,1);
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
    this.props.handleMapClick(event)
  }

  rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
  }

  getMarkerClusterIcon(cluster){
    var children = cluster.getAllChildMarkers();

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
          color: this.rainbow(
            this.props.filters.length, 
            index),
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
        /> 
      ) 
    })

		return icon;
  }
}

export default MapView;
