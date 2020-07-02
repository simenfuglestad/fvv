import React, { Component } from 'react';
import { Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';
import plus_pngrepo from './../assets/plus-pngrepo-com.png';

class ContextMarker extends Component {
    constructor(props) {
      super(props);

      this.icon = Leaflet.icon({
        iconUrl : plus_pngrepo,
        iconSize:     [40, 40],

      });
    }

    render(){
        let lat = this.props.lat;
        let lng = this.props.lng;

        return(
          <Marker position={[lat, lng]} icon={this.icon} onClick={this.props.handleClick}>
          </Marker>
        )
    }
}


export default ContextMarker;
