import React, { Component } from 'react';
import MapView from './MapView';
import RightMenu from './RightMenu';
import PlaceObjectBtn from './PlaceObjectBtn';

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
        btnShowContextMenu : false
    }
    this.swiping = false;

    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.closeDataDisplay = this.closeDataDisplay.bind(this);
    this.togglePolyFilter = this.togglePolyFilter.bind(this);
    this.setPolyFilter = this.setPolyFilter.bind(this);
  }

  render() {
    return (
      <div
        className="Container"
        onMouseDown={() => {this.swiping = true}}
        onMouseUp = {() => {this.swiping = false}}
      >

        <RightMenu
          roadObjectTypes={this.props.roadObjectTypes}
          showMarkerInfo={this.state.showMarkerInfo}
          handleFilters={this.props.handleFilters}
          togglePolyFilter={this.togglePolyFilter}
          handleClickOutside={this.closeDataDisplay}
          contextMenu={this.state.contextMenu}
          handleBtnShowContext={this.handleBtnShowContext}
        />


        <MapView
          currentLocation={this.props.currentLocation}
          map= {this.props.map}
          filters= {this.props.filters}
          roads={this.props.roads}
          issues={this.props.issues}
          drawing={this.state.drawing}
          setPolyFilter={this.setPolyFilter}
          handleMapClick={this.handleMapClick}
          handleMarkerClick={this.handleMarkerClick}
          handleOnMouseMove={this.handleOnMouseMove}
        />
      <PlaceObjectBtn handleBtnShowContext={this.handleBtnShowContext}></PlaceObjectBtn>

      </div>
    );
  }


  handleMarkerClick(marker) {
    this.setState({showMarkerInfo: marker})
  }

  setPolyFilter(polygon){
    this.props.setPoly(polygon)
  }

  closeDataDisplay(){
      this.setState({showMarkerInfo: undefined})
  }

  togglePolyFilter(hasPolygon){
    this.props.setPoly(false)
    this.setState({
      drawing: !hasPolygon,
    })
  }
}

export default Container;
