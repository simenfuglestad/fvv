import React, { Component } from 'react';
import { Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';
import plus_pngrepo from './../assets/plus-pngrepo-com.png';

class ContextMarker extends Component {
    constructor(props) {
      super(props);

      this.openText = "Trykk her for å legge til nytt objekt/hendelse";

      this.icon = Leaflet.icon({
        iconUrl : plus_pngrepo,
        iconSize:     [40, 40],

      });
    }

    handleClick(event) {
      console.log("Got clicked")
    }

    render(){
        let lat = this.props.lat;
        let lng = this.props.lng;

        return(
          <Marker position={[lat, lng]} icon={this.icon} onClick={this.handleClick}>
            <Popup>{this.openText}</Popup>
          </Marker>
        )
    }
}


export default ContextMarker;
