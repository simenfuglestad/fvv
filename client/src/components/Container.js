import React, { Component } from 'react';
import MapView from './MapView';
import ContextMenu from './ContextMenu'
import RightMenu from './RightMenu';
import PlaceObjectBtn from './PlaceObjectBtn';

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
        contextMenu: {show: false},
        btnShowContextMenu : false,
        drawing : false
    }

    this.swiping = false;


    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.closeDataDisplay = this.closeDataDisplay.bind(this);
    this.togglePolyFilter = this.togglePolyFilter.bind(this);
    this.setPolyFilter = this.setPolyFilter.bind(this);
    this.handleBtnShowContext = this.handleBtnShowContext.bind(this);
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
          showMarkerInfo={this.state.showMarkerInfo}
          handleFilters={this.props.handleFilters}
          filters={this.props.filters}
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
          handleMarkerClick={this.handleMarkerClick}
        />

      <PlaceObjectBtn handleBtnShowContext={this.handleBtnShowContext}></PlaceObjectBtn>

      </div>
    );
  }

  handleBtnShowContext(event) {
    alert("Plasser objekt/hendelse på kartet");
    this.setState(prevState => (
      {contextMenu : prevState.contextMenu, btnShowContextMenu : true}
    ));
    console.log(this.state.contextMenu.show);

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
