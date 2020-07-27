import React, { Component } from 'react';
import Select from 'react-select';

class SearchField extends Component {
    constructor(props){
        super(props)
        this.state= {
          data : [],
          selectOptions : []
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
      if(prevProps.data !== this.props.data) {
        this.setState({
          data : this.props.data,
          selectOptions : this.createSelectOptions(this.props.data)
        })
      }
    }

    createSelectOptions(data) {
      if(data !== undefined) {
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
    }

    handleChange(selectedItem) {
      let data = this.props.data;
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
              options={this.state.selectOptions}
            />
        </div>
      );
    }
}

export default SearchField;
