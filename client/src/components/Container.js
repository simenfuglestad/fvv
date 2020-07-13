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
        caseData : null,
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
    this.handleCaseMarkerClick = this.handleCaseMarkerClick.bind(this);
    this.clearImageData = this.clearImageData.bind(this);
    this.toggleObjectReg = this.toggleObjectReg.bind(this);
    this.toggleCaseList = this.toggleCaseList.bind(this);
    this.toggleCaseReg = this.toggleCaseReg.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.caseData !== this.state.caseData && this.state.caseData !== null){
      this.props.getCaseObjects(this.state.caseData.objektListe)
    }
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
          <CaseRegistration 
            map={this.props.map} 
            toggleCaseReg={this.toggleCaseReg} 
            registerCase={this.props.registerCase} 
            data={this.state.caseData}
          />
        }

        { this.state.isCaseListOpen && 
          <CaseList 
            caseList={this.props.caseList} 
            toggleCaseList={this.toggleCaseList}
            selected={this.state.caseData}
            selectCase={this.handleCaseMarkerClick}
          />
        }

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
          caseListAndCurrent={[this.props.caseList, this.state.caseData]}
          shouldCasesShow={this.state.isCaseListOpen || this.state.isCaseMenuOpen ? true : false}
          shouldCaseObjectsShow={true}
          drawing={this.state.drawing}
          setPolyFilter={this.setPolyFilter}
          caseObjects={this.props.caseObjects}
          handleMarkerClick={this.handleMarkerClick}
          handleContextClick={this.handleContextClick}
          handleCaseMarkerClick={this.handleCaseMarkerClick}
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

  handleContextClick(event, latlng) {
    if(event.current.innerHTML === 'Nytt Objekt'){
      this.setState({
        isRegMenuOpen :  true,
      })
      return;
    }
    if(event.current.innerHTML === 'Ny Sak'){
      this.setState({
        isCaseMenuOpen :  true,
        caseData: {lat : latlng[0], lng: latlng[1]}
      })
      return;
    }
  }

  handleCaseMarkerClick(id){
    id= Number(id);
    let clickedCase = this.props.caseList.filter((curCase)=>(curCase.id === id))[0];
    this.setState({caseData: clickedCase})
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
      this.setState({showMarkerInfo: null})
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
      this.setState({isCaseMenuOpen: false, caseData: null})
      this.props.getCaseObjects()
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
        this.setState({isCaseListOpen: false, caseData: thisCase, isCaseMenuOpen: true})
        return;
      } else {
        this.setState({isCaseListOpen: false, caseData: null})
        this.props.getCaseObjects();
        return;
      }
    }
    
    this.setState(prevState => ({isCaseListOpen: !prevState.isCaseListOpen}))
  }
}

export default Container;
