import React, {Component } from 'react';
import Datastore from './../Datastore';
import ExitImg from './../assets/os-x-pngrepo-com.png';
import CameraImg from './../assets/camera-pngrepo-com.png';
import TakeNewPhotoImg from './../assets/redo-pngrepo-com.png';
import RemovePhotoImg from './../assets/unchecked-pngrepo-com.png';
import ConfirmImg from  './../assets/checked-pngrepo-com.png';
import Select from 'react-select';


class RegMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentObjectName : "Velg en kategori",
      currentObjectID : 0,
      enteredData : [],
      objectProperties : {},
      objectPropertyImportances : [], //sorted from most to least
      currentValue : "",
      begunCategorySelect : false,
      NVDBstatus : "",
    };

    //initalizes here if props update before menu is opened
    this.roadObjectTypes = Datastore.get('vegobjekttyper?inkluder=alle');
    this.categoryNamesIDs = this.getObjectNames(this.roadObjectTypes);
    this.categoryOptions = this.createSelectOptions(this.categoryNamesIDs);

    this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.updateUserSelection = this.updateUserSelection.bind(this);
    this.abortBtn = React.createRef();

    this.currentObjectID = -1; //this needs to be outside state or else updating fails
  }

  //wait for props to update, useful if users open menu before loading is complete
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.roadObjects !== this.props.roadObjects) {
      this.roadObjectTypes = Datastore.get('vegobjekttyper?inkluder=alle');
      this.categoryNamesIDs = this.getObjectNames(this.roadObjectTypes);
      this.categoryOptions = this.createSelectOptions(this.categoryNamesIDs);
      this.setState({}) //forces a re-render
    }
    else if(prevProps.objectPos !== this.props.objectPos) {
      console.log("updated object pos");
      console.log(this.props.objectPos);
    }
  }

  createSelectOptions(objects) {
    let result = [];
    objects.forEach((item, i) => {
      result.push({label : item.name, value: i+1});
    });
    return result;
  }

  getObjectNames(objects) {
    let result = [];
    objects.forEach((item, i) => {
      let o = {};
      o["name"] = item.navn;
      o["id"] = item.id;
      result.push(o);
    });

    result.sort(function(a, b) {
      let n = a.name.toLowerCase();
      let m = b.name.toLowerCase();
      if (n < m) return -1;
      else if(n === m) return 0;
      else return 1;
   });
    return result;
  }

  /*
  * Fetches all entries a user can modify during registration
  * return: Structed Object with name as key and list of possible values as value
  */
  fetchObjectProperties(obj) {
    console.log(obj);
    let inputFields = this.sortInputFields(obj);
    let properties = inputFields.egenskapstyper;

    let result = {};

    if(properties !== undefined) {
      properties.forEach((item, i) => {
        let propertyName = item["navn"];
        result[propertyName] = [];

        for (var key in item) {
          if (key === "tillatte_verdier") {
            let tmp_list = [];

            item[key].forEach((item2, i) => {
              tmp_list.push(item2["verdi"]);
            });
            result[propertyName] = tmp_list;
            break;
          }
        }
      });
    }
    return result;
  }


  sortInputFields(object) {
    let importanceLevels = {"PÅKREVD_ABSOLUTT" : 6, "PÅKREVD_IKKE_ABSOLUTT" : 5,
                            "BETINGET" : 4, "OPSJONELL" : 3, "MINDRE_VIKTIG" : 2,
                            "HISTORISK" : 1, "IKKE_SATT" : 0};

    let properties = object.egenskapstyper;
    properties.sort((a, b) => {
        let importance_a = importanceLevels[a.viktighet];
        let importance_b = importanceLevels[b.viktighet];

        if(importance_a < importance_b) return 1;
        else if (importance_a === importance_b) return 0;
        else return -1;
    });

    let sortedImportanceVals = [];
    properties.forEach((item, i) => {
      sortedImportanceVals.push(importanceLevels[item.viktighet])
    });

    this.setState({
      objectPropertyImportances : sortedImportanceVals
    })
    object.egenskapstyper = properties;
    return object;
  }

  formatStatus(status) {
    switch(status.toLowerCase()) {
      case "nvdb, ok" :
        return "OK";
        break;
      case "nvdb, test" :
        return "TEST";
        break;
      case "nvdb, til revisjon" :
        return "TIL REVISJON";
        break;
      default :
        return status;
    }
  }

  setCurrentProperties(objectName) {
    let obj = this.roadObjectTypes;
    obj = obj.filter(v => (v.id === this.currentObjectID))[0];

    if(obj !== undefined && obj !== null) {
      let objProps = this.fetchObjectProperties(obj);
      let status = this.formatStatus(obj.status);
      console.log(status);
      this.setState({
        objectProperties : objProps,
        NVDBstatus : status
      });
    } else {
      //invalid object
        this.setState({
          objectProperties : [],
        });
      }

    }

  setCurrentObjectID(objectName) {
    let obj = this.categoryNamesIDs.filter(o =>{
      return o.name === objectName;
    })[0];
    if(obj !== undefined && obj !== null) {
      this.currentObjectID = obj.id;
    } else {
      this.currentObjectID = -1;
    }
  }

  handleSelectCategoryChange(event) {
    let val = event.label;
    this.setState({currentObjectName : val});
    this.setCurrentObjectID(val);
    this.setCurrentProperties(val);

    let begunCategorySelect;
    if(val ==="Velg en kategori") {
      begunCategorySelect = false;
    } else {
      begunCategorySelect = true;
    }
    this.setState({ begunCategorySelect : begunCategorySelect })
  }

  updateUserSelection(input, index) {
    let data = input.target.value;
    let newEnteredData = [...this.state.enteredData];
    if (input !== "") {
      newEnteredData[index] = data;
    } else {
      newEnteredData[index] = undefined;
    }
    this.setState({
      enteredData : newEnteredData
    });
  }

  handleDoneClick(event) {
    if(this.verifyInput()) {
      this.props.handleDoneReg(this.processEnteredData());
    } else {
      alert("Du har ikke valgt noen verdier! Fyll inn og prøv igjen.")
    }
  }

  verifyInput() {
    if(this.state.enteredData.find(e => e !== undefined)) {
      return true;
    } else {
      return false;
    }
  }

  handleCloseClick(event) {
    this.props.handleClose(event);
  }

  processEnteredData() {
    let resultObject = {
      "registrer": {
        "vegobjekter": [
          {
            "stedfesting": {
              "punkt": [
                {
                  "posisjon": "#pos_placeholder",
                  "veglenkesekvensNvdbId": "#ID_placeholder"
                }
              ]
            },
            "gyldighetsperiode": {
              "startdato": "placeholder#yyyy-mm-dd"
            },
            "typeId": this.currentObjectID,
            "tempId": "placeholder#1",
            "egenskaper": [
            ]
          }
        ]
      },
      "datakatalogversjon": "2.21"
    }

    let properties = [];
    let curObjectData = this.roadObjectTypes.filter(v => (v.id === this.currentObjectID))[0];
    console.log(curObjectData);
    let geoPropIDs = [];
    curObjectData.egenskapstyper.forEach((item, i) => {
      if (item.navn.toLowerCase().startsWith("geometri")) {
        geoPropIDs.push(item.id);
        console.log(item.id);
        console.log(item.navn);
        // properties.push("")
      }
      // console.log(item);
      if (this.state.enteredData[i] !== undefined && this.state.enteredData[i] !=="") {
        // console.log("Verdi : " + this.state.enteredData[i] + "har ID " + item.id);
        properties.push({typeId: item.id, verdi: [this.state.enteredData[i]]})
      }
    });

    resultObject.registrer.vegobjekter[0].egenskaper = properties;
    return resultObject
  }

  render() {
    return (
      <div className="RegMenu">
        <div className="RegSearchDiv">
          <Select className="RegSelectMenu"
                  onChange={(e) => {this.handleSelectCategoryChange(e)}}
                  placeholder="Trykk her for å starte"
                  options={this.categoryOptions}/>
          <br></br>
          {(this.state.NVDBstatus.length > 0) && <label>{"NVDB Status: " + this.state.NVDBstatus}</label>}
        </div>

        <img  src={ExitImg}
              className="ExitRegMenu"
              onClick={() => {this.handleCloseClick(this.abortBtn)}}
              ref={this.abortBtn}/>

        {this.state.begunCategorySelect &&
          <div className="RegForm">
            {Object.keys(this.state.objectProperties).map((k, i) => {
              return (
                <div key={i} className={"RegFormUserInput"}>
                  {(this.state.objectPropertyImportances[i] === 0) && <label className="unspecifiedLabel" key={i+'l'}>{k}</label>}
                  {(this.state.objectPropertyImportances[i] === 1) && <label className="obsoletetLabel" key={i+'l'}>{k}</label>}
                  {(this.state.objectPropertyImportances[i] === 2) && <label className="unimportantLabel" key={i+'l'}>{k}</label>}
                  {(this.state.objectPropertyImportances[i] === 3) && <label className="optionalLabel" key={i+'l'}>{k}</label>}
                  {(this.state.objectPropertyImportances[i] === 4) && <label className="contingentLabel" key={i+'l'}>{k}</label>}
                  {(this.state.objectPropertyImportances[i] === 5) && <label className="importantLabel" key={i+'l'}>{k+"*"}</label>}
                  {(this.state.objectPropertyImportances[i] === 6) && <label className="criticalLabel" key={i+'l'}>{k+"**"}</label>}
                  {this.state.objectProperties[k].length !== 0 ?
                    <select key={i+'s'} defaultValue="" onChange={(e) => this.updateUserSelection(e, i)}>
                    <option value=""></option>
                    {this.state.objectProperties[k].map((v, i) =>
                        <option key={i} value={v}>{v}</option>
                    )}
                  </select>
                  :
                  <input type="text" onChange={(e) => this.updateUserSelection(e, i)}></input>}
                  <br></br>
                </div>
                )
              }
            )}
          </div>
          }

        {this.state.begunCategorySelect &&
          <div className="RegFormUserSubmit">
            {this.props.photo !== null ?
              <div className="PhotoDiv" >
                <img  src={this.props.photo}
                      className="TakenPhoto"/>
                <br></br>
                <img    src={TakeNewPhotoImg}
                        className="TakeNewPhotoImg"
                        onClick={this.props.openCameraView}/>
                <img    src={RemovePhotoImg}
                        className="RemovePhotoImg"
                        onClick={this.props.clearImageData}/>
              </div> :
              <img  className="TakePhotoImg"
                    src={CameraImg}
                    onClick={this.props.openCameraView}/>
            }
            <img    src={ConfirmImg}
                    className="CompleteRegButton"
                    onClick={(e) => this.handleDoneClick(e)}/>
            <br></br>
          </div>
        }
      </div>
    )
  }
}

export default RegMenu;
