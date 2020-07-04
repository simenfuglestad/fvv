import React, {Component } from 'react';
import Datastore from './../Datastore';

class RegMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentObjectName : "Velg en kategori",
      currentSelectValues : [],
      selectIndex : -1,
      currentObjectID : 0,
      enteredData : [],
      currentAllowedValues : {},
      objectDescs : [],
      currentValue : "",
      currentDesc : "", //implement this as tooltip later
      begunCategorySelect : false,
      nameValuePairs : [],
    };

    this.categoryNamesIDs = this.getObjectNames(Datastore.get('vegobjekttyper'));
    this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.currentObjectID = -1; //this needs to be outside state or else updating fails
    this.handleSelectValue = this.handleSelectValue.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
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
    let attributes = obj.egenskapstyper;
    let result = {};
    if(attributes !== undefined) {
      attributes.forEach((item, i) => {

        let name = item["navn"];
        let req_sel = false;
        for (var key in item) {

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
      });
    }
    return result;
  }

  testfetchVals() {
    let obj = Datastore.get('vegobjekttyper/79');
    let f_obj = this.fetchVals(obj);
  }

  setCurrentVals(objectName) {
    let obj = Datastore.get('vegobjekttyper/' + this.currentObjectID.toString());
    let desc = obj["beskrivelse"];
    let allowedVals = this.fetchVals(obj);
      if(obj !== undefined && obj !== null) {
        this.setState({
          currentAllowedValues : allowedVals,
          nameValuePairs : allowedVals,
          currentDesc : desc
        });

      } else {
        console.log("invalid object")
        this.setState({
          currentAllowedValues : [],
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
    } else {
      this.currentObjectID = -1;
    }
  }

  handleSelectCategoryChange(event) {
    let val = event.target.value;
    console.log(event.target);
    this.setState({currentObjectName : val});
    this.setCurrentObjectID(val);
    this.setCurrentVals(val);

    let begunCategorySelect;
    if(val ==="Velg en kategori") {
      begunCategorySelect = false;
    } else {
      begunCategorySelect = true;
    }
    this.setState({ begunCategorySelect : begunCategorySelect })
  }

  updateUserSelection(data, index) {
    console.log("index is " + index)
    let newEnteredData = [...this.state.enteredData];
    newEnteredData[index] = data;
    this.setState(prevState => ({
      enteredData : newEnteredData
    }));
    console.log(this.state.enteredData)
  }

  handleSelectValue(event, i) {
    console.log(event.target.value);
    this.updateUserSelection(event.target.value, i);
    this.setState({
      currentDesc : this.state.currentDesc
    });
  }

  handleInputChange(event, i) {
    console.log(event.target.value);
    this.updateUserSelection(event.target.value, i);
  }

  handleDoneClick(event) {
    console.log(this.state.enteredData)
    if(this.state.enteredData.length !== 0) {
      let processedData = this.processEnteredData(this.state.enteredData, this.state.currentAllowedValues);
      this.props.handleDoneReg(processedData);
    } else {
      alert("Du har ikke valgt noen verdier! Fyll inn og prøv igjen.")
    }
  }

  handleCloseClick(event) {
    this.props.handleClose();
  }

  processEnteredData() {
    let resultObject = {};
    console.log(this.state.enteredData.length);
    Object.keys(this.state.currentAllowedValues).forEach((item, i) => {
      if (this.state.enteredData[i] !== undefined && this.enteredData !=="Velg en verdi") {
        resultObject[item] = this.state.enteredData[i];
      } else {
        resultObject[item] = "ingen verdi oppgitt";
      }
    });
    return resultObject
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
              {Object.keys(this.state.currentAllowedValues).map((k, i) =>
                {if(this.state.currentAllowedValues[k].length !== 0) return (
                  <div key={i} className="regFormUserInput">
                    <label key={i+'l'}>{k}</label>

                    <select key={i+'s'} defaultValue={"Velg en verdi"} onClick={(e) => this.handleSelectValue(e, i)}>
                      <option value="Velg en verdi">Velg en verdi</option>
                      {this.state.currentAllowedValues[k].map((v, i) =>
                          <option key={i} value={v}>{v}</option>
                      )}
                    </select>
                    <br></br>
                  </div>
                )
                else return (
                  <div key={i} className="regFormUserInput">
                    <label key={i+'l'}>{k}</label>
                    <input type="text" onChange={(e) => this.handleInputChange(e, i)}></input>
                    <br></br>
                  </div>
                )}
              )}
            </div>
          }
          <br></br>
          {this.state.begunCategorySelect && <div className="regFormUserSubmit">
            <input type="button" value="Fullfør" onClick={(e) => this.handleDoneClick(e)}></input>
            <input type="button" value="Lukk" onClick={this.handleCloseClick}></input>
          </div>
          }
        </div>
      </div>
    )
  }
}

export default RegMenu;
