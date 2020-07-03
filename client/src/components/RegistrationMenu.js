import React, {Component } from 'react';
import Datastore from './../Datastore';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataEntryNames : [],
      currentObjectName : "Velg en kategori",
      currentValueName : "Velg en verdi",
      currentObjectID : 0,
      enteredData : [],
      currentAllowedValues : [],
      objectDescs : [],
      currentValue : "",
      currentDesc : "",
      begunCategorySelect : false,
      nameValuePairs : [],
      requireSelect : [], // order of values that require select menu
      // currentDescValue
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

  /*
  * Fetches all entries a user can modify during registration
  * Structed as Object with name as key and list of possible values as value
  */
  fetchVals(obj) {
    // console.log(obj)
    let attributes = obj.egenskapstyper;
    console.log(attributes);
    let result = {};
    if(attributes !== undefined) {
      attributes.forEach((item, i) => {
        // console.log(i)
        // console.log(item)
        let name = item["navn"];
        let found_allowed = false;
        let req_sel = false;
        for (var key in item) {
          // console.log(key)
          result[name] = [];
          if (key === "tillatte_verdier") {
            let tmp_list = [];

            item[key].forEach((item2, i) => {
              tmp_list.push(item2["verdi"]);
            });
            result[name] = tmp_list;

            req_sel = true;
            break;
          }
        }
        let rs = this.state.requireSelect;
        rs.push(req_sel);
        this.setState({
          requireSelect : rs
        })
      });
    }
    return result;
  }

  testfetchVals() {
    let obj = Datastore.get('vegobjekttyper/79');
    let f_obj = this.fetchVals(obj);
  }

  setDataEntryNames(objectName) {
    let obj = Datastore.get('vegobjekttyper/' + this.currentObjectID.toString());
    let desc = obj["beskrivelse"];
    let allowedVals = this.fetchVals(obj);
      // console.log(allowedVals);
      if(obj !== undefined && obj !== null) {
        this.setState({
          currentAllowedValues : allowedVals,
          dataEntryNames : Object.keys(obj),
          nameValuePairs : allowedVals,
          currentDesc : desc
        });

      } else {
        console.log("invalid object")
        this.setState({
          currentAllowedValues : [],
          dataEntryNames : [],
          nameValuePairs : [],
          currentDesc : ""
        });
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
    this.setState({ begunCategorySelect : true })
  }

  handleSelectValue(event) {
    this.setState({
      currentValueName : event.target.value,
      currentDesc : this.state.currentDesc
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
    // console.log(resultObject);
  }

  constructRegFields = fields => {
    let result = []
    for(let i = 0; i < this.state.nameValuePairs.length; i++) {
      if(this.state.nameValuePairs.length === 0) {
        result.push(
          <div key={i}><input type="text"></input></div>)
      }
    }
    return result;
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
          {this.state.begunCategorySelect &&
            <div>
              {Object.keys(this.state.nameValuePairs).map((k, i) =>
                <div key={i}>
                  <label key={i+'l'}>{k}</label>
                  <select key={i+'s'} value={this.state.currentAllowedValues[k]} onChange={this.handleSelectValue}>
                    {this.state.nameValuePairs[k].map((v, i) =>
                      <option key={i} value={v}>{v}</option>
                    )}
                  </select>
                  <br></br>
                </div>
              )}
            </div>
          }
          <br></br>
          <div className="regFormUserInput">
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
