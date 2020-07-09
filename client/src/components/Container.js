import React, { Component } from 'react';
import MapView from './MapView';
import RightMenu from './RightMenu';
import RegistrationMenu from './RegistrationMenu';
import CaseRegistration from './CaseRegistration';
import CaseList from './CaseList';
import CameraView from './CameraView';


class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isRegMenuOpen : false,
        isCaseMenuOpen: false,
        isCaseListOpen: false,
        drawing : false,
        isCameraOpen : false,
        currentRegObject : {},
        objectImage : null,
        caseData : {},
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
    this.toggleObjectReg = this.toggleObjectReg.bind(this);
    this.toggleCaseList = this.toggleCaseList.bind(this);
    this.toggleCaseReg = this.toggleCaseReg.bind(this);
  }

  render() {
    return (
      <div
        className="Container"
      >
        { !this.state.isCaseListOpen && <button className='openCaseListBtn' onClick={this.toggleCaseList}>Saksliste</button>}

        {this.state.isCameraOpen &&
          <CameraView
            closeCameraView={this.handleCloseCamera}>
          </CameraView>
        }

        {
          this.state.isRegMenuOpen &&

          <RegistrationMenu
            handleDoneReg={this.handleDoneReg}
            handleClose={this.toggleObjectReg}
            openCameraView={this.handleOpenCamera}
            photo={this.state.objectImage}
            clearImageData={this.clearImageData}>

          </RegistrationMenu>
        }

        {
          this.state.isCaseMenuOpen &&
          <CaseRegistration map={this.props.map} toggleCaseReg={this.toggleCaseReg} registerCase={this.props.registerCase} data={this.state.caseData}/>
        }

        { this.state.isCaseListOpen && <CaseList caseList={this.props.caseList} toggleCaseList={this.toggleCaseList}/>}

        <RightMenu
          roadObjectTypes={this.props.roadObjectTypes}
          showMarkerInfo={this.state.showMarkerInfo}
          handleFilters={this.props.handleFilters}
          filters={this.props.filters}
          togglePolyFilter={this.togglePolyFilter}
          handleClickOutside={this.closeDataDisplay}
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

  toggleObjectReg(){
    this.setState(prevState => ({isRegMenuOpen: !prevState.isRegMenuOpen}))
  }

  toggleCaseReg(){
    if(this.state.isCaseMenuOpen){
      this.setState({isCaseMenuOpen: false, caseData: {}})
    } else {
      this.setState({isCaseMenuOpen: true})
    }
  }
    

  toggleCaseList(id = null){
    if(!this.state.isCaseListOpen){
      //if opening menu, refresh caselist data
      this.props.getCaseList()
    } else {
      if(id !== null){
        //if an id was sent open caseReg and fill in data for that id
        let thisCase = this.props.caseList.filter((e) => (e.id === Number(id)))[0];
        this.setState(prevState => ({isCaseListOpen: !prevState.isCaseListOpen, caseData: thisCase, isCaseMenuOpen: true}))
        return;
      }
    }
    
    this.setState(prevState => ({isCaseListOpen: !prevState.isCaseListOpen}))
  }
}

export default Container;
