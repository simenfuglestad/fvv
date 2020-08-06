import React, { Component } from 'react';
import { Marker, Polyline, Polygon, Pane} from 'react-leaflet';
import Leaflet from 'leaflet';
import checkmark_border from '../assets/checkmark-circle-2-outline.svg';
import ColorPicker from './ColorPicker';

class MarkerManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
        markers: {},
    }
    this.colorScheme = ['#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#ffff99','#cab2d6','#fdbf6f','#fb9a99','#b2df8a','#a6cee3'];
  }

  componentDidMount(){
    let markers = {}
        
          Object.entries(this.props.map).forEach(([key, value]) => {
              if(this.props[key] !== value){
                  markers[key] = this.drawMapObjects(this.props.map[key], this.props.filters);
              } else {
                  markers[key] = this.state.markers[key]
              }
          })
          this.setState({markers: markers})
  }

  shouldComponentUpdate(nextProps, nextState){
      if(this.state.markers !== nextState.markers){
          return true;
      }

      if(nextProps.map === null){
        this.setState({markers: {}})
        return false;
      }

      if(this.props.map !== nextProps.map){
          let markers = {}
        
          Object.entries(nextProps.map).forEach(([key, value]) => {
              if(nextProps[key] !== value){
                  markers[key] = this.drawMapObjects(nextProps.map[key], nextProps.filters);
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
      return(<Pane style={{zIndex: this.props.zIndex}}>{markers}</Pane>);
  }

  drawMapObjects(objects, filters){
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
            <Marker position={point} key={item.id} icon={this.getIcon(item.metadata.type.id, filters, this.props.checkmark)} onClick={(event) => {this.props.handleClick(event,item)}} >
            </Marker>
          );
        } else if(geoJSON.type === 'LineString') {
          let latLngList = Array.from(geoJSON.coordinates.map(coords => (coords.slice(0,2))));
          return (
            <Polyline color='red' positions= {latLngList} key={index} onClick={() => {this.props.handleClick(item)}}>
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

  getIcon(id, filters, checkmark){
    let color;
    
    if(id){
      color = ColorPicker.get(id)
    } else {
      console.log('marker using default color')
      color = 'black'
    }
  
    const markerHtmlStyles = `
    background-color: ${color};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem;
    border: 1px solid #FFFFFF;`

    if(checkmark){
      return Leaflet.divIcon({
        className: id,
        iconAnchor: [0, 0],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" ><img src="${checkmark_border}" alt="Green checkmark" style="width: 2rem; height: 2rem;"></span>`
      })
    } else {
      return Leaflet.divIcon({
        className: id,
        iconAnchor: [0, 0],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
      })
    }
  }
}

export default MarkerManager;