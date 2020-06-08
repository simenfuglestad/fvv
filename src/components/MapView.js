import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import {VenueLocationIcon} from './VenueLocationIcon';
import 'leaflet/dist/leaflet.css';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: { lat: 60.390461, lng: 5.328283 },
      zoom: 12,
    }
  }

  render() {
    const { currentLocation, zoom } = this.state;

    return (
      this.props.data.objekter ?
      <Map center={currentLocation} zoom={zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          {
            this.props.data.objekter.map((data, index) => {
              try{
                //console.log('cake!')
              var parse = require('wellknown')
              const geoJSON = parse(data.geometri.wkt)
              const point = [geoJSON['coordinates'][0], geoJSON['coordinates'][1]]
            
              return (
                <Marker position={point} key={index} icon={VenueLocationIcon} >
                  <Popup>
                    <span>{data.metadata.type.navn} ID: {data.id}</span>
                  </Popup>
                </Marker>
              );
              } catch(err) {
                console.log(data);
                return null;
              }
              
            })
          }

        </Map>
      :
      <Map center={currentLocation} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
      </Map>
    );
  }
}

export default MapView;
