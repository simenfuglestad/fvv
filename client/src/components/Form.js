import React, {Component } from 'react';
import Datastore from './../Datastore';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataEntryNames : [],
      dataentryIDs : [],
      // displayingEntries : false
    };
    this.currentObjectname = "Velg en kategori";
    this.currentObjectID = 0;
    this.categoryNamesIDs = this.getObjectNames(Datastore.get('vegobjekttyper'));

    this.handleChange = this.handleChange.bind(this);
  }

  getObjectNames(objects) {
    let result = [];
    objects.forEach((item, i) => {
      let o = {};
      o["name"] = item.navn;
      o["id"] = item.id;
      result.push(o);
    });

    console.log(result)
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
    console.log(obj);
    this.setState({
      dataEntryNames : Object.keys(obj)
    });
  }

  setCurrentObjectID(objectName) {
    console.log(this.categoryNamesIDs);
    let obj = this.categoryNamesIDs.filter(o =>{
      return o.name === objectName;
    })[0];
    if(obj)
    console.log(obj)
    console.log(obj.id);
    this.currentObjectID = obj.id;
  }

  handleChange(event) {
    console.log(event.target.value);
    this.currentObjectName = event.target.value;
    this.setCurrentObjectID(event.target.value);
    console.log(this.currentObjectID);
    this.setDataEntryNames(event.target.value);

  }


  render() {
    return (
      <div className="regMenu">
        <select value={this.currentObjectname} onChange={this.handleChange}>
            <option value="Velg en kategori">Velg En kategori</option>
          {this.categoryNamesIDs.map((object, i) =>
            <option key = {i} value={object.name}>{object.name}</option>
          )}
        </select>

        <div className="regForm">
          {this.state.dataEntryNames.map((object, i) =>
            <div className="regPosSubDiv" key={i}>
              <label>{object}</label>
              <input type="text"></input>
            </div>
          )}
          </div>
      </div>
    )
  }
}

export default Form;
