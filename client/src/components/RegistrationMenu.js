import React, {Component } from 'react';
import Datastore from './../Datastore';

class RegMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentObjectName : "Velg en kategori",
      currentObjectID : 0,
      enteredData : [],
      objectProperties : {},
      currentValue : "",
      begunCategorySelect : false,
    };

    this.categoryNamesIDs = this.getObjectNames(Datastore.get('vegobjekttyper'));

    this.handleSelectCategoryChange = this.handleSelectCategoryChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
    this.handleSelectValue = this.handleSelectValue.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);

    this.abortBtn = React.createRef();

    this.currentObjectID = -1; //this needs to be outside state or else updating fails
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
  fetchObjectProperties(obj) {
    let attributes = obj.egenskapstyper;
    let result = {};
    if(attributes !== undefined) {
      attributes.forEach((item, i) => {

        let name = item["navn"];
        for (var key in item) {

          result[name] = [];
          if (key === "tillatte_verdier") {
            let tmp_list = [];

            item[key].forEach((item2, i) => {
              tmp_list.push(item2["verdi"]);
            });
            result[name] = tmp_list;
            break;
          }
        }
      });
    }
    return result;
  }

  setCurrentVals(objectName) {
    let obj = Datastore.get('vegobjekttyper/' + this.currentObjectID.toString());
    let objProps = this.fetchObjectProperties(obj);
      if(obj !== undefined && obj !== null) {
        this.setState({
          objectProperties : objProps,
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
    let val = event.target.value;
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
    let newEnteredData = [...this.state.enteredData];
    newEnteredData[index] = data;
    this.setState(prevState => ({
      enteredData : newEnteredData
    }));
  }

  handleSelectValue(event, i) {
    this.updateUserSelection(event.target.value, i);
  }

  handleInputChange(event, i) {
    this.updateUserSelection(event.target.value, i);
  }

  handleDoneClick(event) {
    if(this.state.enteredData.length !== 0) {
      let processedData = this.processEnteredData(this.state.enteredData, this.state.objectProperties);
      this.props.handleDoneReg(processedData);
    } else {
      alert("Du har ikke valgt noen verdier! Fyll inn og prøv igjen.")
    }
  }

  handleCloseClick(event) {
    this.props.handleClose(event);
  }

  processEnteredData() {
    let resultObject = {};
    Object.keys(this.state.objectProperties).forEach((item, i) => {
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
              {Object.keys(this.state.objectProperties).map((k, i) =>
                {if(this.state.objectProperties[k].length !== 0) return (
                  <div key={i} className="regFormUserInput">
                    <label key={i+'l'}>{k}</label>

                    <select key={i+'s'} defaultValue={"Velg en verdi"} onClick={(e) => this.handleSelectValue(e, i)}>
                      <option value="Velg en verdi">Velg en verdi</option>
                      {this.state.objectProperties[k].map((v, i) =>
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
            <input type="button" value="Avbryt" onClick={() => {this.handleCloseClick(this.abortBtn)}} ref={this.abortBtn}></input>
          </div>
          }
        </div>
      </div>
    )
  }
}

export default RegMenu;
