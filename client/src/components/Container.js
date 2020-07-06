import React, { Component } from 'react';
import MapView from './MapView';
import ContextMenu from './ContextMenu'
import RightMenu from './RightMenu';
import RegistrationMenu from './RegistrationMenu';
import CaseRegistration from './CaseRegistration';
import CameraView from './CameraView';

class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isRegMenuOpen : false,
        isCameraOpen : false,
        drawing : false,
        currentRegObject : {},
        objectImage : null
    }

    this.swiping = false;
    this.isCameraOpen = false;
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.closeDataDisplay = this.closeDataDisplay.bind(this);
    this.togglePolyFilter = this.togglePolyFilter.bind(this);
    this.setPolyFilter = this.setPolyFilter.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleDoneReg = this.handleDoneReg.bind(this);
    this.handleOpenCamera = this.handleOpenCamera.bind(this);
    this.handleCloseCamera = this.handleCloseCamera.bind(this);
  }

  render() {
    if (!this.state.isCameraOpen) {
      return (
        <div
          className="Container"
          onMouseDown={() => {this.swiping = false}}
          onMouseMove={() => {this.swiping = true}}
        >
          {
            this.state.isRegMenuOpen &&

            <RegistrationMenu
              handleDoneReg={this.handleDoneReg}
              handleClose={this.handleContextClick}
              openCameraView={this.handleOpenCamera}
              >

            </RegistrationMenu>
          }


          <RightMenu
            roadObjectTypes={this.props.roadObjectTypes}
            showMarkerInfo={this.state.showMarkerInfo}
            handleFilters={this.props.handleFilters}
            filters={this.props.filters}
            togglePolyFilter={this.togglePolyFilter}
            handleClickOutside={this.closeDataDisplay}
            contextMenu={this.state.contextMenu}
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
            handleContextClick={this.handleContextClick}
          />

          }
        </div>
      );
    } else {
      return (
        <CameraView
          isFullScreen={true}
          closeCameraView={this.handleCloseCamera}
        >
        </CameraView>
      )
    }
  }

  handleOpenCamera(event) {
    this.setState({
      isCameraOpen : true,
    });
  }

  handleCloseCamera(imgData) {
    if(imgData !== null && imgData !== undefined) {
      this.setState({
        isCameraOpen : false,
        objectImage : imgData,
        isRegMenuOpen : false
      });
    } else {
      this.setState(prevState => ({
        isCameraOpen : false,
        objectImage : prevState.objectImage,
        isRegMenuOpen : false
      }));
    }
  }

  handleContextClick(event) {
    this.setState({
      isRegMenuOpen :  !this.state.isRegMenuOpen,
    })
  }

  handleDoneReg(newObject) {
    console.log(newObject);
    alert("Du har fullført registrering");
    this.setState({
      isRegMenuOpen : false,
      currentRegObject : newObject
    })
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
