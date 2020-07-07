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
        contextMenu: {show: false},
        isRegMenuOpen : false,
        isCaseMenuOpen: false,
        drawing : false,
        isRegMenuOpen : false,
        isCameraOpen : false,
        drawing : false,
        currentRegObject : {},
        objectImage : null
    }

    this.isCameraOpen = false;
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.closeDataDisplay = this.closeDataDisplay.bind(this);
    this.togglePolyFilter = this.togglePolyFilter.bind(this);
    this.setPolyFilter = this.setPolyFilter.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleDoneReg = this.handleDoneReg.bind(this);
    this.handleOpenCamera = this.handleOpenCamera.bind(this);
    this.handleCloseCamera = this.handleCloseCamera.bind(this);
    this.clearImageData = this.clearImageData.bind(this);
  }

  render() {
    return (
      <div
        className="Container"
      >
        {this.state.isCameraOpen &&
          <CameraView
            closeCameraView={this.handleCloseCamera}>
          </CameraView>
        }

        {
          this.state.isRegMenuOpen &&

          <RegistrationMenu
            handleDoneReg={this.handleDoneReg}
            handleClose={this.handleContextClick}
            openCameraView={this.handleOpenCamera}
            photo={this.state.objectImage}
            clearImageData={this.clearImageData}>
            >

          </RegistrationMenu>
        }

        {this.state.contextMenu.show && <ContextMenu details={this.state.contextMenu} handleClick={this.handleContextClick}/>}
        {
          this.state.isCaseMenuOpen &&
          <CaseRegistration/>
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
      </div>
    );
  }

  clearImageData(event) {
    this.setState({
      objectImage :  null
    })
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
        // isRegMenuOpen : false
      });
    } else {
      this.setState(prevState => ({
        isCameraOpen : false,
        objectImage : prevState.objectImage,
        // isRegMenuOpen : false
      }));
    }
  }

  handleContextClick(event) {
    if(!event){
      this.setState(prevState => ({
        isRegMenuOpen: !prevState.isRegMenuOpen
      }))
      return;
    }
    if(event.current.innerHTML === 'Nytt Objekt'){
      this.setState({
        isRegMenuOpen :  true,
      })
      return;
    }
    if(event.current.innerHTML === 'Ny Sak'){
      this.setState({
        isCaseMenuOpen :  true,
      })
      return;
    }
  }

  handleFinishReg(event) {
    alert("Du har fullført registrering");
    this.setState({
      isRegMenuOpen : false,
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
