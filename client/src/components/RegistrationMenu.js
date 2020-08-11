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
      enteredData : [],
      objectProperties : {},
      objectPropertyImportances : [], //sorted from most to least
      currentValue : "",
      begunCategorySelect : false,
      NVDBstatus : "",
    };

    //initalizes here if props update before menu is opened
    this.roadObjectTypes = Datastore.get('vegobjekttyper?inkluder=alle');
    this.categoryNamesToIDs = null;
    this.categoryOptions = null;
    this.initData(this.roadObjectTypes);

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
      this.initData(this.roadObjectTypes);
      this.setState({}) //forces a re-render
    }
  }

  initData(objects) {
    let namesToIDs = {};
    let categoryOptions = [];
    objects.forEach((item, i) => {
      namesToIDs[item["navn"]] = item["id"];
      categoryOptions.push({label : item["navn"], value : i+1});

    });
    categoryOptions.sort(function(a, b) {
      let n = a.label.toLowerCase();
      let m = b.label.toLowerCase();
      if (n < m) return -1;
      else if(n === m) return 0;
      else return 1;
   });
    this.categoryNamesToIDs = namesToIDs;
    this.categoryOptions = categoryOptions;
  }

  /*
  * Fetches all entries a user can modify during registration
  * return: Structed Object with name as key and list of possible values as value
  */
  fetchObjectProperties(obj) {
    let inputFields = this.sortInputFields(obj);
    let properties = inputFields.egenskapstyper;

    let result = {};

    if(properties !== undefined) {
      properties.forEach((item, i) => {
        let propertyName = item["navn"];
        if (item["tillatte_verdier"]) {
          let allowed_vals = [];
          item["tillatte_verdier"].forEach((item2, i) => {
            allowed_vals.push(item2["verdi"]);
          });
          result[propertyName] = allowed_vals;
        } else {
          result[propertyName] = [];
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
        let importance_a = importanceLevels[a["viktighet"]];
        let importance_b = importanceLevels[b["viktighet"]];

        if(importance_a < importance_b) return 1;
        else if (importance_a === importance_b) return 0;
        else return -1;
    });

    let sortedImportanceVals = [];
    properties.forEach((item, i) => {
      sortedImportanceVals.push(importanceLevels[item["viktighet"]])
    });

    this.setState({
      objectPropertyImportances : sortedImportanceVals
    })
    object.egenskapstyper = properties;
    return object;
  }

  formatStatus(status) {
    if (status.toLowerCase().startsWith("nvdb")) {
      return status.slice(6); //kutt "nvdb, " fra statusfelt
    } else {
      return "UKJENT"
    }
  }

  setCurrentProperties(objectName) {
    let obj = this.roadObjectTypes.filter(v => (v.id === this.currentObjectID))[0];
    console.log(this.currentObjectID);
    console.log(obj);
    if(obj !== undefined && obj !== null) {
      let objProps = this.fetchObjectProperties(obj);
      let status = this.formatStatus(obj.status);
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

  handleSelectCategoryChange(event) {
    let val = event.label;
    this.currentObjectID = this.categoryNamesToIDs[val];
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

  //Verify that at least one field is not empty, placeholder for better validation
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
                  "posisjon": 0.3,
                  "veglenkesekvensNvdbId": 1125766
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

    curObjectData.egenskapstyper.forEach((item, i) => {
      if (this.state.enteredData[i] !== undefined && this.state.enteredData[i] !=="") {
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
              alt={"Close"}
              className="ExitRegMenu"
              onClick={() => {this.handleCloseClick(this.abortBtn)}}
              ref={this.abortBtn}
              alt="exit"/>

        {this.state.begunCategorySelect &&
          <div className="RegForm">
            {Object.keys(this.state.objectProperties).map((k, i) => {
              return (
                <div key={i} className={"RegFormUserInput"}>
                  {(this.state.objectPropertyImportances[i] === 0) && <label className="unspecifiedLabel" key={i+'l'}>{k}</label>}
                  {(this.state.objectPropertyImportances[i] === 1) && <label className="obsoleteLabel" key={i+'l'}>{k}</label>}
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
                      alt={"Userphoto goes here"}
                      className="TakenPhoto"/>
                <br></br>
                <img    src={TakeNewPhotoImg}
                        alt={"Bring up camera"}
                        className="TakeNewPhotoImg"
                        onClick={this.props.openCameraView}/>
                <img    src={RemovePhotoImg}
                        alt={"Remove"}
                        className="RemovePhotoImg"
                        onClick={this.props.clearImageData}/>
              </div> :
              <img  className="TakePhotoImg"
                    alt={"Bring up camera"}
                    src={CameraImg}
                    onClick={this.props.openCameraView}/>
            }
            <img    src={ConfirmImg}
                    alt={"Confirm Registration"}
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
