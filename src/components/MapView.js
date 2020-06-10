import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import {VenueLocationIcon} from './VenueLocationIcon';
import 'leaflet/dist/leaflet.css';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 15,
    }

  }




  render() {

    return (
      this.props.data.objekter ?
      <Map center={this.props.currentLocation} zoom={this.state.zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          {
            this.props.data.objekter.map((data, index) => {
              try{
              var parse = require('wellknown')
              const geoJSON = parse(data.geometri.wkt)
              if(geoJSON.type === 'Point'){
                const point = [geoJSON['coordinates'][0], geoJSON['coordinates'][1]]
            
                return (
                  <Marker position={point} key={index} icon={VenueLocationIcon} >
                    <Popup>
                      <span>{data.metadata.type.navn} ID: {data.id}</span>
                    </Popup>
                  </Marker>
                );
              } else {
                console.log('Invalid geoJSON: ' + geoJSON.type);
                return null;
              }

              } catch(err) {
                console.log(data);
                return null;
              }
              
            })
          }

        </Map>
      :
      <Map center={this.props.currentLocation} zoom={this.state.zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
      </Map>
    );
  }
}

export default MapView;
