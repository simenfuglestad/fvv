import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline, Polygon, GeoJSON } from 'react-leaflet';
import {VenueLocationIcon} from './VenueLocationIcon';
import {RedMarker} from './RedMarker';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

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

          <MarkerClusterGroup spiderfyOnMaxZoom={false} disableClusteringAtZoom={18}>
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
          <Marker position={item.geometry.coordinates} key={index} icon={VenueLocationIcon} >
            <Popup>{item.properties.name + ' ' + item.properties.date}</Popup>
          </Marker>
        )
      })
    );
  }

  drawMapObjects(objects){
    console.log(objects)
    return(
      objects.map((item, index) => {
        try{
          if(!this.props.filters.includes(item.metadata.type.id)){
            return null;
          }

          var parse = require('wellknown')
          const geoJSON = parse(item.geometri.wkt)
          if(geoJSON.type === 'Point'){
            const point = [geoJSON['coordinates'][0], geoJSON['coordinates'][1]]
            let icon = VenueLocationIcon;
            return (
              <Marker position={point} key={index} icon={this.getIcon(item.metadata.type.id)} onClick={this.props.handleMarkerClick} >
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
    console.log(objects)
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
    const icons = {79: RedMarker, 83: VenueLocationIcon, 87: VenueLocationIcon}
    return icons[id];
  }

  handleClick(event) {
    this.props.onClick(event)
  }
}

export default MapView;
