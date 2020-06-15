import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import {VenueLocationIcon} from './VenueLocationIcon';
import {RedMarker} from './RedMarker';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 15,
    }
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
              <Marker position={point} key={index} icon={this.getIcon(item.metadata.type.id)} >
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
    let result = []
    objects.forEach(element => {
      result.push(Array.from(this.drawMapObjects(element.veglenker)))
    });
    return result;
  }

  getIcon(id){
    const icons = {79: RedMarker, 83: VenueLocationIcon, 87: VenueLocationIcon}
    return icons[id];
  }

  render() {
    return (
      <Map center={this.props.currentLocation} zoom={this.state.zoom} maxZoom={19}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          
          <MarkerClusterGroup spiderfyOnMaxZoom={false} disableClusteringAtZoom={18}>
           {this.props.filters.length !== 0 && this.drawMapObjects(this.props.data)}
          </MarkerClusterGroup>
          
          {this.drawRoads(this.props.roads)}

        </Map>
    );
  }
}

export default MapView;
