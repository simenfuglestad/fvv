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
    this.handleMovePoint = this.handleMovePoint.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }

  componentDidUpdate(prevProps){
    if(prevProps.drawing !== this.props.drawing){
      this.setState({polygonPoints: [], finished: false})
    }
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
        zoom={this.state.zoom} maxZoom={19}
        onclick={this.handleClick}
        oncontextmenu={this.handleContextMenu}
        >
          {this.state.showContextMenu && <ContextMarker lat={this.state.contextMenuDetails.lat} lng={this.state.contextMenuDetails.lng} handleClick={this.props.handleContextClick}/>}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />

          <PolygonDrawer polygon={this.state.polygonPoints} finished={this.state.finished} handleMovePoint={this.handleMovePoint}/>

          {this.drawIssueMarkers(this.props.issues)}


          <MarkerClusterGroup spiderfyOnMaxZoom={false} disableClusteringAtZoom={18} iconCreateFunction={this.getMarkerClusterIcon}>
            <MarkerManager map={this.props.map} filters={this.props.filters} handleClick= {this.props.handleMarkerClick}/>

            {this.drawRoads(this.props.roads)}
          </MarkerClusterGroup>

        </Map>
    );
  }

  componentDidUpdate(prevProps){
    if(prevProps.drawing !== this.props.drawing){
      this.setState({polygonPoints: [], finished: false})
    }
  }

  drawIssueMarkers(issueMarkers){
    return (
      issueMarkers.map((item,index) => {
        return(
          <Marker position={item.geometry.coordinates} key={index} icon={this.getIcon()} >
            <Popup>{item.properties.name + ' ' + item.properties.date}</Popup>
          </Marker>
        )
      })
    );
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
        showContextMenu : false,
        polygonPoints: prevstate.polygonPoints.concat([[event.latlng.lat, event.latlng.lng]])
      }))
    } else if (this.state.showContextMenu === true) {
        this.setState(prevState => (
          {
            showContextMenu : false,
          }
        ))
    }
  }

  handleMovePoint(){
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

    let data = this.props.filters.map((type, index) => {
      if(clusterTypes[type.id]) {
        return ({
          title: type.id,
          value: clusterTypes[type.id],
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
