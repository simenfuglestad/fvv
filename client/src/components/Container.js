import React, { Component } from 'react';
import MapView from './MapView';
import Menu from './Menu';
import MapFilter from './MapFilter';
import ContextMenu from './ContextMenu'

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
        contextMenu: {show: false},
    }

    this.swiping = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
  }

  render() {
    return (
      <div 
        className="Container" 
        onMouseDown={() => {this.swiping = false}} 
        onMouseMove={() => {this.swiping = true}} 

      >
        <Menu 
          issueRegistration={this.state.issueRegistration} 
          latlng={{lat: this.state.contextMenu.lat, lng: this.state.contextMenu.lng}}
          handleRegistration={this.props.handleRegistration}
        />

        {this.state.contextMenu.show && <ContextMenu details={this.state.contextMenu} handleClick={this.handleContextClick}/>} 

        <MapView
          currentLocation={this.props.currentLocation}
          map= {this.props.map}
          filters= {this.props.filters}
          roads={this.props.roads}
          issues={this.props.issues}
          onClick={this.handleClick}
        />
        <MapFilter
          data={this.state.menu}
          handleFilters={this.props.handleFilters}
        />

      </div>
    );
  }

  handleClick(event){
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
