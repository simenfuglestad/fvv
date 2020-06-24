import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

class SearchField extends Component {
    constructor(props){
        super(props)
        this.state= {
            query: '',
            filteredData: []
        }

        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    render() {
        return (
          <div className="searchField">
            <form>
              <input
                className='searchField-input'
                placeholder="Search for..."
                value={this.state.query}
                onChange={this.handleInputChange}
              />
            </form>
            <div className='searchfield-choices'>{this.state.filteredData.map(i => <p key={i.id} className="searchfield-choice" onClick={() => {this.handleSelect(i)}}>{i.navn}</p>)}</div>
          </div>
        );
      }

    handleInputChange = event => {
        const query = event.target.value;

        this.setState(prevState => {
          let filteredData = this.props.data.filter(element => {
            return element.navn.toLowerCase().includes(query.toLowerCase());
          });

          filteredData.sort(function(a, b) {
            let n = a.navn.toLowerCase();
            let m = b.navn.toLowerCase();
            if (n < m) return -1;
            else if(n === m) return 0;
            else return 1;
         });

          return {
            query,
            filteredData
          };
        });
    };

    handleClickOutside(event){
      this.setState({query: '', filteredData: []});
    }

    handleSelect(i){
      this.setState({query: '', filteredData: []});
      this.props.handleFilterSelect(i);
    }
}

export default onClickOutside(SearchField);
