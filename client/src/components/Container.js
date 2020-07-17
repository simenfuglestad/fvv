import React, { Component } from 'react';
import Leaflet from 'leaflet';
import { PieChart } from 'react-minimal-pie-chart';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import ReactDOMServer from 'react-dom/server';
import MapView from './MapView';
import RightMenu from './RightMenu';
import RegistrationMenu from './RegistrationMenu';
import CaseRegistration from './CaseRegistration';
import CaseList from './CaseList';
import CameraView from './CameraView';
import WorkOrderForm from './WorkOrderForm';
import MarkerManager from './MarkerManager';
import ColorPicker from './ColorPicker'

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
        markerCollections: {},
        mapMarkers: {},
        caseData : null,
    }

    this.isCameraOpen = false;

    this.closeDataDisplay = this.closeDataDisplay.bind(this);
    this.setPolyFilter = this.setPolyFilter.bind(this);
    this.clearImageData = this.clearImageData.bind(this);
    this.getMarkerClusterIcon = this.getMarkerClusterIcon.bind(this);
    this.addMarkerCollection = this.addMarkerCollection.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleContextClick = this.handleContextClick.bind(this);
    this.handleDoneReg = this.handleDoneReg.bind(this);
    this.handleOpenCamera = this.handleOpenCamera.bind(this);
    this.handleCloseCamera = this.handleCloseCamera.bind(this);
    this.handleCaseMarkerClick = this.handleCaseMarkerClick.bind(this);
    this.togglePolyFilter = this.togglePolyFilter.bind(this);
    this.toggleObjectReg = this.toggleObjectReg.bind(this);
    this.toggleCaseList = this.toggleCaseList.bind(this);
    this.toggleCaseReg = this.toggleCaseReg.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.map !== this.props.map){
      console.log(nextProps.map)
      this.setState({mapMarkers: this.getMarkers(nextProps.map, nextProps.filters, true)});
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState){
    let typeIds = new Set();
    for (const typeId of Object.keys(this.props.map)) {
      typeIds.add(typeId);
    }

    for (const collection of Object.values(this.state.markerCollections)) {
      for (const typeId of Object.keys(collection.props.map)) {
        typeIds.add(typeId);
      }
    }

    ColorPicker.removeUnusedIds(typeIds);
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
            clickedMarker={this.state.clickedMarker}
            addMarkerCollection={this.addMarkerCollection}
          />
        }

        { this.state.isCaseListOpen && 
          <CaseList 
            caseList={this.props.caseList} 
            toggleCaseList={this.toggleCaseList}
            selected={this.state.caseData}
            selectCase={this.handleCaseMarkerClick}
            addMarkerCollection={this.addMarkerCollection}
          />
        }

        { this.state.isWorkOrderOpen &&
          <WorkOrderForm addWorkOrder={this.addWorkOrder}/>
        }

        <RightMenu
          roadObjectTypes={this.props.roadObjectTypes}
          showMarkerInfo={this.state.showMarkerInfo}
          handleFilters={this.props.handleFilters}
          filters={this.props.filters}
          map={this.props.map}
          togglePolyFilter={this.togglePolyFilter}
          handleClickOutside={this.closeDataDisplay}
        />

        <MapView
          currentLocation={this.state.currentLocation ? this.state.currentLocation : this.props.currentLocation}
          caseListAndCurrent={[this.props.caseList, this.state.caseData]}
          shouldCasesShow={this.state.isCaseListOpen || this.state.isCaseMenuOpen ? true : false}
          shouldCaseObjectsShow={true}
          drawing={this.state.drawing}
          map={this.state.mapMarkers}
          markerCollections={this.state.markerCollections}
          setPolyFilter={this.setPolyFilter}
          handleContextClick={this.handleContextClick}
          handleCaseMarkerClick={this.handleCaseMarkerClick}
        />
      </div>
    );
  }

  async addMarkerCollection(objects, key, checkmark){
    let newMarkerCollections = {...this.state.markerCollections};
    let markerObjects = await this.props.getCaseObjects(objects);
    newMarkerCollections[key] = this.getMarkers(markerObjects, this.props.filters, false, checkmark, 601)
    console.log(newMarkerCollections)
    this.setState({markerCollections: newMarkerCollections})
  }

  getMarkers(markerObjects, filters, clustered = false, checkmark = false, zIndex = 600){

    if(clustered){
      return(
        <MarkerClusterGroup spiderfyOnMaxZoom={true} disableClusteringAtZoom={18} iconCreateFunction={this.getMarkerClusterIcon}>
          <MarkerManager map={markerObjects} filters={filters} handleClick={this.handleMarkerClick} checkmark={checkmark} zIndex={zIndex}/>
        </MarkerClusterGroup>
      )
    } else {
      return <MarkerManager map={markerObjects} filters={filters} handleClick={this.handleMarkerClick} checkmark={checkmark} zIndex={zIndex}/>
    }
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
    if(!this.state.isCaseMenuOpen){
      id= Number(id);
      let clickedCase = this.props.caseList.filter((curCase)=>(curCase.id === id))[0];
      this.addMarkerCollection(clickedCase.objektListe, 'caseObjects', true)

      this.setState({caseData: clickedCase, currentLocation: {lat: clickedCase.lat, lng: clickedCase.lng}})
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

  handleMarkerClick(marker, object) {
    console.log(marker)
    this.setState({showMarkerInfo: object, clickedMarker: {marker: marker, object: object}})
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
      this.setState({isCaseMenuOpen: false, caseData: null, markerCollections: {}})
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
        this.setState({isCaseListOpen: false, caseData: null, markerCollections: {}})
        return;
      }
    }
    
    this.setState(prevState => ({isCaseListOpen: !prevState.isCaseListOpen}))
  }

  getMarkerClusterIcon(cluster){
    var children = cluster.getAllChildMarkers();
    var childCount = cluster.getChildCount();

    const clusterTypes = children.reduce(function (acc, curr) {
      const id = curr.options.icon.options.className;
      if (typeof acc[id] == 'undefined') {
        acc[id] = 1;
      } else {
        acc[id] += 1;
      }

      return acc;
    }, {});

    let data = this.props.filters.map((filter, index) => {
      if(clusterTypes[filter.id]) {
        return ({
          title: filter.id,
          value: clusterTypes[filter.id],
          color: ColorPicker.get(filter.id),
          })
      } else {
        return;
      }
    })

    data = data.filter((item) => (item != null))


    const icon = Leaflet.divIcon({
      className: "my-custom-pin",
      iconSize: new Leaflet.Point(40, 40),
      html: ReactDOMServer.renderToString(
        <PieChart
          data={data}
          label={({ dataEntry }) => childCount}
          labelStyle={{
            fontSize: '40px',
            fontFamily: 'sans-serif',
            fill: 'white',
            textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
          }}
          labelPosition={0}
        />
      )
    })

		return icon;
  }
}

export default Container;
