import React, {Component } from 'react';
import Datastore from './../Datastore';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataEntryNames : [],
      dataentryIDs : [],
      currentObjectName : "Velg en kategori",
      currentObjectID : 0,
      enteredData : [],
    };
    this.categoryNamesIDs = this.getObjectNames(Datastore.get('vegobjekttyper'));

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDoneClick = this.handleDoneClick.bind(this);
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

  setDataEntryNames(objectName) {
    let obj = Datastore.get('vegobjekttyper').filter(o =>{
      return o.navn === objectName;
    })[0];
    if(obj !== undefined && obj !== null) {
      this.setState({dataEntryNames : Object.keys(obj)});
    } else {
      this.setState({dataEntryNames : []});
    }
  }

  setCurrentObjectID(objectName) {
    let obj = this.categoryNamesIDs.filter(o =>{
      return o.name === objectName;
    })[0];
    if(obj !== undefined && obj !== null) {
      this.setState({currentObjectID : obj.id});
    } else {
      this.setState({currentObjectID : 0});
    }
  }

  handleChange(event) {
    this.setState({currentObjectName : event.target.value});
    this.setCurrentObjectID(event.target.value);
    this.setDataEntryNames(event.target.value);
    this.clearInputFields();
  }

  clearInputFields() {
    this.setState({
      enteredData : [],
    })
  }

  handleInputChange(event, i) {
    let temp = [...this.state.enteredData];
    temp[i] = event.target.value;

    this.setState(prevState => ({
      enteredData : temp
    }));
  }

  handleDoneClick(event) {
  }


  render() {
    return (
      <div className="regMenu">
        <select className="regSelectMenu" value={this.state.currentObjectname} onChange={this.handleChange}>
            <option value="Velg en kategori">Velg En kategori</option>
            {this.categoryNamesIDs.map((object, i) =>
              <option key={i} value={object.name}>{object.name}</option>
            )}
        </select>

        <div className="regForm">
          {this.state.dataEntryNames.map((object, i) =>
            <div className="regPosSubDiv" key={i}>
              <label>{object}</label>
              <input  id="regInputId"
                      onChange={(e) => this.handleInputChange(e, i)}
                      type="text">
              </input>
            </div>
          )}
          <input type="button" value="Fullfør" onClick={(e) => this.handleDoneClick(e)}></input>
        </div>
      </div>
    )
  }
}

export default Form;
