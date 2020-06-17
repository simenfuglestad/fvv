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
    this.registerIssue = this.registerIssue.bind(this);
  }

  render() {
    return (
      <div 
        className="Container" 
        onMouseDown={() => {this.swiping = false}} 
        onMouseMove={() => {this.swiping = true}} 
        onClick={this.handleClick}
      >
        <Menu issueRegistration={this.state.issueRegistration}/>

        {this.state.contextMenu.show && <ContextMenu x={this.state.contextMenu.x} y={this.state.contextMenu.y} handleClick={this.registerIssue}/>} 

        <MapView
          currentLocation={this.props.currentLocation}
          data={this.props.map}
          filters={this.props.filters}
          roads={this.props.roads}
          onClick={this.handleContextMenu}
        />
        <MapFilter
          data={this.state.menu}
          handleFilters={this.props.handleFilters}
        />

      </div>
    );
  }

  handleClick(event){
    console.log(event)
    if(event.target.classList.contains('leaflet-container') && !this.state.contextMenu.show && !this.swiping){
        this.setState({contextMenu: {show: true, x: event.pageX, y: event.pageY}})    
    } else if(!event.target.classList.contains('ContextMenu')) {
        this.setState({contextMenu: {show: false}});
    }
  }

  registerIssue(){
    this.setState({issueRegistration: true})
  }
}

export default Container;
