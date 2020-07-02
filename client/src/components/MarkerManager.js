import React, { Component } from 'react';
import { Marker, Polyline, Polygon} from 'react-leaflet';
import Leaflet from 'leaflet';

class MarkerManager extends Component {
    constructor(props) {
      super(props);
      this.state = {
          markers: {},
      }
      this.colorScheme = ['#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#ffff99','#cab2d6','#fdbf6f','#fb9a99','#b2df8a','#a6cee3'];
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.state.markers !== nextState.markers){
            return true;
        }

        if(this.props.map !== nextProps.map){
            let markers = {}
          
            Object.entries(nextProps.map).forEach(([key, value]) => {
                if(nextProps[key] !== value){
                    markers[key] = this.drawMapObjects(nextProps.map[key]);
                } else {
                    markers[key] = nextState.markers[key]
                }
            })
            this.setState({markers: markers})
            return false;
        }
        return false;
    }

    render(){
        let markers = [];
        Object.entries(this.state.markers).forEach(([key, marker]) => {
            markers.push(marker);
        })
        return(markers);
    }

    drawMapObjects(objects){
        if(!objects){
          return []
        }
        let parse = require('wellknown')
    
        return (objects.map((item, index) => {
          try{
    
            const geoJSON = parse(item.geometri.wkt);
            if(geoJSON.type === 'Point'){
              const point = [geoJSON['coordinates'][0], geoJSON['coordinates'][1]]
              return (
                <Marker position={point} key={item.id} icon={this.getIcon(item.metadata.type.id)} onClick={() => {this.props.handleClick(item)}} >
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
         }));
      }

      getIcon(id){
        let color;
        let idIndex = this.props.filters.findIndex((filter) => (
          filter.id === id
        ))
        
        if(id){
          color = this.colorScheme[idIndex%this.colorScheme.length]
        } else {
          console.log('marker using default color')
          color = this.colorScheme[idIndex%this.colorScheme.length]
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
}

export default MarkerManager;