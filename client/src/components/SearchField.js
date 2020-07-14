import React, { Component } from 'react';
import Select from 'react-select';

class SearchField extends Component {
    constructor(props){
        super(props)
        this.state = {
            data : this.props.data,
            selectOptions : []
        }
        this.selectOptions = [];
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      let data = this.state.data;
      if(data !== undefined) {
        let selectOptions = this.createSelectOptions(data);
        this.selectOptions = selectOptions;
      }
    }

    createSelectOptions(data) {
      let result = [];
      data.forEach((item, i) => {
        result.push({label : item.navn, value: i+1});
      });

      result.sort(function(a, b) {
        let n = a.label.toLowerCase();
        let m = b.label.toLowerCase();
        if (n < m) return -1;
        else if(n === m) return 0;
        else return 1;
      });
      return result;
    }

    static getDerivedStateFromProps(props, currentState) {
      if(props.data !== currentState.data) {
        return {
          query : currentState.query,
          data : props.data
        };
      }
      return null;
    }

    handleChange(selectedItem) {
      let data = this.state.data;
      data.forEach((item, i) => {
        if(item.navn === selectedItem.label) {
          this.props.handleFilterSelect(item);
        }
      });
    }

    render() {
      return (
        <div className="searchField">
          <Select
              className="searchField-input"
              placeholder="Søk etter..."
              onChange={this.handleChange}
              options={this.selectOptions}
            />
        </div>
      );
    }
}

export default SearchField;
