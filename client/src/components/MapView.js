import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Map, TileLayer, Marker, Popup, Polyline, Polygon} from 'react-leaflet';
import { PieChart } from 'react-minimal-pie-chart';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PolygonDrawer from './PolygonDrawer';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import Leaflet from 'leaflet';
import MarkerManager from './MarkerManager';
import ContextMarker from './ContextMarker'
import red_marker from '../assets/red_marker.png';

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
      ontextMenuDetails: {lat : 0, lng : 0},
      showContextMenu : false,
    }
    this.colorScheme = ['#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#ffff99','#cab2d6','#fdbf6f','#fb9a99','#b2df8a','#a6cee3'];
    this.markers = {};

    this.handleClick = this.handleClick.bind(this);
    this.getMarkerClusterIcon = this.getMarkerClusterIcon.bind(this);
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
          {this.state.showContextMenu && <ContextMarker lat={this.state.contextMenuDetails.lat} lng={this.state.contextMenuDetails.lng} handleClick={this.handleContextClick}/>}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          <PolygonDrawer polygon={this.state.polygonPoints} finished={this.state.finished} handleFinishPoly={this.handleFinishPoly}/>

          {this.props.shouldCasesShow && this.drawCaseMarkers(this.props.caseListAndCurrent)}
          {
            this.props.shouldCaseObjectsShow && 
            <MarkerManager 
              map={this.props.caseObjects} 
              handleClick= {this.props.handleMarkerClick} 
              filters={Object.keys(this.props.caseObjects)}/>}


          <MarkerClusterGroup spiderfyOnMaxZoom={true} disableClusteringAtZoom={18} iconCreateFunction={this.getMarkerClusterIcon}>
            <MarkerManager map={this.props.map} handleClick={this.props.handleMarkerClick} filters={this.props.filters}/>

            {this.drawRoads(this.props.roads)}
          </MarkerClusterGroup>

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

  drawCaseObjects(objects){
    console.log(objects)
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

  drawRoads(objects){
    var parse = require('wellknown')
    return(
      objects.map((item,index) => {
        const geoJSON = parse(item.geometri.wkt)

        let latLngList = Array.from(geoJSON.coordinates.map(coords => (coords.slice(0,2))));
        return (
          <Polyline color='red' positions= {latLngList} key={index}>
              </Polyline>
        );
      })
    );
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

  getMarkerClusterIcon(cluster){
    var children = cluster.getAllChildMarkers();
    var childCount = cluster.getChildCount();

    const clusterTypes = children.reduce(function (acc, curr) {
      const id = curr.options.icon.options.className;
      if (typeof acc[id] == 'undefined') {
        acc[id] = 1;
      } else {
        acc[id] += 1;
      }

      return acc;
    }, {});

    let data = this.props.filters.map((filter, index) => {
      if(clusterTypes[filter.id]) {
        return ({
          title: filter.id,
          value: clusterTypes[filter.id],
          color: this.colorScheme[index%this.colorScheme.length],
          })
      } else {
        return;
      }
    })

    data = data.filter((item) => (item != null))


    const icon = Leaflet.divIcon({
      className: "my-custom-pin",
      iconSize: new Leaflet.Point(40, 40),
      html: ReactDOMServer.renderToString(
        <PieChart
          data={data}
          label={({ dataEntry }) => childCount}
          labelStyle={{
            fontSize: '40px',
            fontFamily: 'sans-serif',
            fill: 'white',
            textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
          }}
          labelPosition={0}
        />
      )
    })

		return icon;
  }
}

export default MapView;
