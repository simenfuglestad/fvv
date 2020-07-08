import React, { Component } from 'react';
import Leaflet from 'leaflet';
import { Marker, Polygon, Polyline } from 'react-leaflet';


class PolygonDrawer extends Component{
    constructor(props){
        super(props);
        
        this.markerHtmlStyles = `
            background-color: blue;
            opacity: 0.5;
            width: 15px;
            height: 15px;
            display: block;
            border: 1px solid #FFFFFF`

        this.icon = Leaflet.divIcon({
            className: 'corner',
            html: `<span style="${this.markerHtmlStyles}" />`
            })
    }

   render(){
    let corners = Array.from(this.props.polygon.map((point, index) => (
        <Marker position={point} icon={this.icon} key={index} onclick={(event) => {this.handleFinishPoly(event, index)}}/>
    )));
    if(this.props.finished){
        corners.push(<Polygon color='red' fillOpacity ={0.05} positions= {this.props.polygon} key={this.props.polygon}/>);
    } else {
        corners.push(<Polyline color='red' positions= {this.props.polygon} key={this.props.polygon}/>);
    }

    return corners;
   }

   handleFinishPoly(event,index){
       if(index === 0){
           this.props.handleFinishPoly();
       }
   }
}

export default PolygonDrawer;