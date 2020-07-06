import React, { Component } from 'react';
import { Popup } from 'react-leaflet';

class ContextMarker extends Component {
    constructor(props) {
      super(props);

      this.objectBtn = React.createRef();
      this.caseBtn = React.createRef();
    }

    render(){
        let latlng = [this.props.lat, this.props.lng];

        return(
          <Popup className='contextMarker' position={latlng} onClose={() => {this.props.handleClick()}}>
            <button onClick={() => {this.props.handleClick(this.objectBtn)}} ref={this.objectBtn}>Nytt Objekt</button>
            <button onClick={() => {this.props.handleClick(this.caseBtn)}} ref={this.caseBtn}>Ny Sak</button>
          </Popup>
        )
    }
}


export default ContextMarker;
