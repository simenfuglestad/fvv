import React, { Component } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import Menu from './components/Menu';
import MapFilter from './components/MapFilter';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: [],
      map: [],
    }

    //bind functions that need a reference to this instance
    this.handleFilters = this.handleFilters.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Menu 
          data={this.state.menu}
          handleFilters={this.handleFilters}
        />
        <MapView
          data={this.state.map}
        />
        <MapFilter
          data={this.state.menu}
          handleFilters={this.handleFilters}
        />

      </div>
    );
  }

  async componentDidMount() {
    const res = await axios.get('https://nvdbapiles-v3.utv.atlas.vegvesen.no/omrader/kommuner', {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}})

    const data = res.data;
    this.setState({menu: data});
  }

  async handleFilters(kommune) {
    let kommuner = '';
    kommune.forEach(element => {
      kommuner += element.nummer + ',';
    });
    if(kommuner){
      try {
        const res = await axios.get('https://nvdbapiles-v3.utv.atlas.vegvesen.no/vegobjekter/79?inkluder=alle&srid=4326&antall=10000&kommune=' + kommuner, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}})
  
        const data = res.data;
        console.log(data);
        this.setState({map: data});
      } catch(error) {
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      }
    } else {
      this.setState({map: []})
    }
  }  
}

export default App;
