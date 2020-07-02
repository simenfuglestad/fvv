import React, {Component } from 'react';
import Datastore from './../Datastore';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataEntryNames : [],
      dataentryIDs : [],
      currentObjectName : "Velg en kategori",
      currentValueName : "Velg en verdi",
      currentObjectID : 0,
      enteredData : [],
      objectAllowedValues : [],
      objectDescs : [],
      currentDesc : "beskrivelse",
      begunCategoerySelect : false,
      begunValueSelect : false,
      // currentObjectDesc : "",
      // currentObjectValue : ,
    };

    this.categoryNamesIDs = this.getObjectNames(Datastore.get('vegobjekttyper'));
    this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.currentObjectID = -1;
    this.handleSelectValue = this.handleSelectValue.bind(this);
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

  getDesc(values) {
    let result = [];
  }

  setDataEntryNames(objectName) {
    // let obj = Datastore.get('vegobjekttyper/'+ this.currentObjectID.toString()).filter(o =>{
    //   return o.navn === objectName;
    // })[0];
    let obj = Datastore.get('vegobjekttyper/' + this.currentObjectID.toString());
    let tmp = obj.egenskapstyper[8].tillatte_verdier;
    let allowedVals = [];
    let descs = [];

    tmp.forEach((item, i) => {
      allowedVals.push(item.verdi);
      descs.push(item.beskrivelse);
    });
    if(obj !== undefined && obj !== null) {
      this.setState({
        objectAllowedValues : allowedVals,
        objectDescs : descs,
        dataEntryNames : Object.keys(obj)});
    } else {
      this.setState({
        objectAllowedValues : [],
        objectDescs : [],
        dataEntryNames : []});
    }
  }

  setCurrentObjectID(objectName) {
    let obj = this.categoryNamesIDs.filter(o =>{
      return o.name === objectName;
    })[0];
    if(obj !== undefined && obj !== null) {
      this.currentObjectID = obj.id;
      // this.setState({currentObjectID : obj.id});
    } else {
      this.currentObjectID = -1;
      // this.setState({currentObjectID : 0});
    }
  }

  handleSelectCategoryChange(event) {
    this.setState({currentObjectName : event.target.value});
    this.setCurrentObjectID(event.target.value);
    this.setDataEntryNames(event.target.value);
    this.clearInputFields();
    this.setState({ begunCategoerySelect : true })
  }

  handleSelectValue(event) {
    this.setState({
      currentValueName : event.target.value,
      currentDesc : event.target.value
    });
  }

  clearInputFields() {
    this.setState({
      enteredData : [],
    })
  }

  handleInputChange(event, i) {
    let newEnteredData = [...this.state.enteredData];
    newEnteredData[i] = event.target.value;

    this.setState(prevState => ({
      enteredData : newEnteredData
    }));
  }

  handleDoneClick(event) {
    let processedData = this.processEnteredData(this.state.enteredData, this.state.dataEntryNames);
    this.props.handleDoneReg(processedData);
    // this.dat
  }

  processEnteredData(data, names) {
    let resultObject = {};
    for(var i = 0; i < data.length; i++) {
      let propName = this.state.dataEntryNames[i];
      let propData = data[i];
      if (propData !== undefined && propData !== null) {
        resultObject[propName] = propData;
      }
      else {
          resultObject[propName] = " ";
      }
    }
    console.log(resultObject);
  }



  render() {
    return (
      <div className="regMenu">
        <select className="regSelectMenu" value={this.state.currentObjectname} onChange={this.handleSelectCategoryChange}>
            <option value="Velg en kategori">Velg En kategori</option>
            {this.categoryNamesIDs.map((object, i) =>
              <option key={i} value={object.name}>{object.name}</option>
            )}
        </select>

        <div className="regForm">
          {this.state.begunCategoerySelect &&
            <select value={this.state.currentValueName} onChange={this.handleSelectValue}>
              <option value ="chooseVal">Velg en Verdi</option>
              {this.state.objectAllowedValues.map((val, i) =>
                <option key={i} value={val}>{val}</option>
              )}
            </select>
          }
          <br></br>
          <div>
            <label>{this.state.currentDesc}</label>
            <input type="button" value="Fullfør" onClick={(e) => this.handleDoneClick(e)}></input>
          </div>
        </div>
      </div>
    )
  }
}

export default Form;

/*
{this.state.objectDescs.map((object, i) =>
  <div className="regPosSubDiv" key={i}>
    <label>{object}</label>
    <input  id="regInputId"
            onChange={(e) => this.handleInputChange(e, i)}
            type="text">
    </input>
  </div>
)}
*/
