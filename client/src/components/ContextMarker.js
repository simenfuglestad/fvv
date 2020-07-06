import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
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

      this.objectBtn = React.createRef();
      this.caseBtn = React.createRef();
    }

    render(){
        let lat = this.props.lat;
        let lng = this.props.lng;

        return(
          <Popup position={[lat, lng]}>
            <button onClick={() => {this.props.handleClick(this.objectBtn)}} ref={this.objectBtn}>Nytt Objekt</button>
            <button onClick={() => {this.props.handleClick(this.caseBtn)}} ref={this.caseBtn}>Ny Sak</button>
          </Popup>
        )
    }
}


export default ContextMarker;
