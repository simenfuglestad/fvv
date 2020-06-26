import React, { Component } from 'react';
import MapView from './MapView';
import ContextMenu from './ContextMenu'
import RightMenu from './RightMenu';
import PlaceObjectBtn from './PlaceObjectBtn';

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
        contextMenu: {show: false, x : 0, y : 0},
        btnShowContextMenu : false
    }
    this.mouseDown = false;
    this.swiping = false;

    this.mouseDragStart = {x : 0, y : 0};
    this.contextMenuStartPos = {x : 0, y : 0};

    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.closeDataDisplay = this.closeDataDisplay.bind(this);
    this.togglePolyFilter = this.togglePolyFilter.bind(this);
    this.setPolyFilter = this.setPolyFilter.bind(this);
    this.handleBtnShowContext = this.handleBtnShowContext.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
  }

  render() {
    return (
      <div
        className="Container"
        onMouseDown={() => {this.swiping = true}}
        onMouseUp = {() => {this.swiping = false}}
      >

        {this.state.contextMenu.show && <ContextMenu details={this.state.contextMenu} handleClick={this.handleContextClick}/>}

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

  handleOnMouseMove(event) {
    const containerPoint = event.containerPoint;
    const cx = containerPoint.x;
    const cy = containerPoint.y;
    // console.log(event);
    if (this.state.contextMenu.show) {
      if (!this.swiping) {
        this.mouseDragStart = {x: cx, y:cy};
      } else {
        let mds = this.mouseDragStart;

        if (cx < mds.x) {
          console.log("Going east");
          let diff = mds.x - cx;
          this.setState(prevState => (
            {contextMenu : {show : true, x : prevState.contextMenu.x-diff, y:prevState.contextMenu.y}}
          ));
        }
        else if (cx > mds.x) {
          console.log("Going west");
          let diff = cx-mds.x;
          this.setState(prevState => (
            {contextMenu : {show : true, x : prevState.contextMenu.x+diff, y:prevState.contextMenu.y}}
          ));
        }
        if (cy > mds.y) {
          console.log("Going South");
          let diff = mds.y - cy;
          this.setState(prevState => (
            {contextMenu : {show : true, x:prevState.contextMenu.x, y : prevState.contextMenu.y-diff}}
          ));
        }
        else if (cy < mds.y) {
          console.log("Going north");
          let diff = cy - mds.y;
          console.log(diff)
          this.setState(prevState => (
            {contextMenu : {show : true, x:prevState.contextMenu.x, y : prevState.contextMenu.y+diff}}
          ));
        }
        this.mouseDragStart = {x:cx, y: cy};
      }
    }
  }

  handleBtnShowContext(event) {
    alert("Plasser objekt/hendelse på kartet");
    this.setState(prevState => (
      {contextMenu : prevState.contextMenu, btnShowContextMenu : true}
    ));
  }

  handleMarkerClick(marker) {
    this.setState({showMarkerInfo: marker})
  }

  setPolyFilter(polygon){
    this.props.setPoly(polygon)
  }

  handleMapClick(event){
    const origin = event.originalEvent;

    if(origin.target.classList.contains('leaflet-container') && !this.state.contextMenu.show && !this.swiping && this.state.btnShowContextMenu){
        this.setState({contextMenu: {show: true, x: origin.pageX, y: origin.pageY,  lat: event.latlng.lat, lng: event.latlng.lng}, btnShowContextMenu : false})
    } else if(!origin.target.classList.contains('ContextMenu')) {
        if (this.state.btnShowContextMenu) {
          this.setState({contextMenu: {show: true, x: origin.pageX, y: origin.pageY,  lat: event.latlng.lat, lng: event.latlng.lng}, btnShowContextMenu : false})
        } else if (!this.stateBtnShowContexMenu) {
          this.setState(prevState => (
            {contextMenu: {show: false, x: prevState.contextMenu.x, y : prevState.contextMenu.y}, btnShowContextMenu : prevState.btnShowContextMenu}
          ));
        }
      }
  }

  handleContextClick(){
    this.setState(prevState => (
      {issueRegistration: true, contextMenu: {show: false, lat: prevState.contextMenu.lat, lng: prevState.contextMenu.lng}}
    ));
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
