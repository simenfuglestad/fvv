import React, { Component } from 'react';
import MapView from './MapView';
import Menu from './Menu';
import ContextMenu from './ContextMenu'
import RightMenu from './RightMenu';

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
        contextMenu: {show: false},
    }

    this.swiping = false;

    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  render() {
    return (
      <div 
        className="Container" 
        onMouseDown={() => {this.swiping = false}} 
        onMouseMove={() => {this.swiping = true}} 
      >

        {this.state.contextMenu.show && <ContextMenu details={this.state.contextMenu} handleClick={this.handleContextClick}/>} 

        <RightMenu
          roadObjectTypes={this.props.roadObjectTypes}
          handleFilters={this.props.handleFilters}
          showMarkerInfo={this.state.showMarkerInfo}
        />

        <MapView
          currentLocation={this.props.currentLocation}
          map= {this.props.map}
          filters= {this.props.filters}
          roads={this.props.roads}
          issues={this.props.issues}
          handleMapClick={this.handleMapClick}
          handleMarkerClick={this.handleMarkerClick}
        />

      </div>
    );
  }

  handleMarkerClick(marker) {
    this.setState({showMarkerInfo: marker})
    console.log(marker)
  }

  handleMapClick(event){
    const origin = event.originalEvent;
    if(origin.target.classList.contains('leaflet-container') && !this.state.contextMenu.show && !this.swiping){
        this.setState({contextMenu: {show: true, x: origin.pageX, y: origin.pageY,  lat: event.latlng.lat, lng: event.latlng.lng}})    
    } else if(!origin.target.classList.contains('ContextMenu')) {
        this.setState({contextMenu: {show: false}});
    }

    this.props.testRoadSelect(event.latlng.lat, event.latlng.lng)
  }

  handleContextClick(){
    
    this.setState(prevState => (
      {issueRegistration: true, contextMenu: {show: false, lat: prevState.contextMenu.lat, lng: prevState.contextMenu.lng}}
    ));
  }
}

export default Container;
