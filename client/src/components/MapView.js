import React, { Component } from 'react';
import { Map, TileLayer, Marker} from 'react-leaflet';
import PolygonDrawer from './PolygonDrawer';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import Leaflet from 'leaflet';
import ContextMarker from './ContextMarker';

/**
 * props:
 * data: map, roads, issues, filters
 * currentLocation
 * onClick
 */
class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 15,
      polygonPoints: [],
      finished: false,
      contextMenuDetails: {lat : 0, lng : 0},
      showContextMenu : false,
    }

    this.markers = {};

    this.handleClick = this.handleClick.bind(this);
    this.handleFinishPoly = this.handleFinishPoly.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
  }

  handleContextMenu(event) {
    if(!this.props.drawing || this.state.finished) {
      let lat = event.latlng.lat;
      let lng = event.latlng.lng;

      this.setState(
        {showContextMenu : true, contextMenuDetails : {lat : lat, lng : lng}}
      );
    }
  }

  render() {
    return (
        <Map
        center={this.props.currentLocation}
        zoomControl={false}
        zoom={this.state.zoom} maxZoom={19}
        onclick={this.handleClick}
        oncontextmenu={this.handleContextMenu}
        >
          {this.state.showContextMenu && 
            <ContextMarker 
              lat={this.state.contextMenuDetails.lat} 
              lng={this.state.contextMenuDetails.lng} 
              handleClick={this.handleContextClick}
            />
          }

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          <PolygonDrawer polygon={this.state.polygonPoints} finished={this.state.finished} handleFinishPoly={this.handleFinishPoly}/>

          {this.props.shouldCasesShow && this.drawCaseMarkers(this.props.caseListAndCurrent)}

          {this.props.markerCollections.caseObjects}
          {this.props.markerCollections.workorderObjects}
          {Object.keys(this.props.map).length !== 0 && this.props.map}
        </Map>
    );
  }

  handleContextClick(button){
    this.setState({
      showContextMenu: false
    })
    if(button){
      this.props.handleContextClick(button, [this.state.contextMenuDetails.lat, this.state.contextMenuDetails.lng]);
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.drawing !== this.props.drawing){
      this.setState({polygonPoints: [], finished: false})
    }
  }

  drawCaseMarkers(caseListAndCurrent){
    let caseList = caseListAndCurrent[0];
    let currentCase = caseListAndCurrent[1];

    let markers = [];
    caseList.map((item,index) => {
      markers.push(
        <Marker 
          position={{lat: item.lat, lng: item.lng}} 
          key={item.id} 
          icon={this.getIcon(index, 'red')} 
          onClick={() =>this.props.handleCaseMarkerClick(item.id)} >
        </Marker>
      )
    })
    if(currentCase){
      markers.push(<Marker position={{lat: currentCase.lat, lng: currentCase.lng}} key={'currentMarker'} icon={this.getIcon('currentMarker','yellow')} ></Marker>)
    }

    return (
      markers
    );
  }

  getIcon(id, color){
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

  handleClick(event) {
    if(this.props.drawing && !this.state.finished){
      this.setState((prevstate) => ({
        polygonPoints: prevstate.polygonPoints.concat([[event.latlng.lat, event.latlng.lng]])
      }))
    } else if (this.state.showContextMenu === true) {
      
    }
  }

  handleFinishPoly(){
    this.setState({finished: true})
    this.props.setPolyFilter(this.state.polygonPoints)
  }
}

export default MapView;