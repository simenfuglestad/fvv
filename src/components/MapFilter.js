import React, { Component } from 'react';
import DropDown from './DropDown';

class MapFilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            expanded: false,
            height: '40px',
            width: '40px',
            municipalities: [],
            roadObjects: [],
        }
        this.toggleWindow = this.toggleWindow.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
    }

    toggleWindow() {
        if(this.state.expanded){
            this.setState({height: '40px', width: '40px'});
        } else {
            this.setState({height: '500px', width: '200px'});
        }

        this.setState(prevState => ({
            expanded: !prevState.expanded
          }));
    }

    addFilter(item){
        this.setState(prevState => {
            this.props.handleFilters(prevState.roadObjects.concat(item.nummer));
            return{roadObjects: prevState.roadObjects.concat(item.nummer)};  
        });
        
    }

    removeFilter(item){
        this.setState(prevState => {
            this.props.handleFilters(prevState.roadObjects.filter((i) => i !== item.nummer));
            return{roadObjects: prevState.roadObjects.filter((i) => i !== item.nummer)};
        });
    }

    render(){
        return(
            <div className='mapfilter-container' style={{height: this.state.height, width: this.state.width}}>
                {this.state.expanded && 
                <DropDown
                    title='Velg vegobjekt'
                    list={[{navn: 'Stikkrenne/kulvert', nummer: 79}, {navn: 'Kum', nummer: 83}, {navn: 'Belysningspunkt', nummer: 87}]}
                    selected={this.state.roadObjects}
                    addFilter={this.addFilter}
                    removeFilter={this.removeFilter}
                />}
                <button className='mapfilter-toggle' onClick={this.toggleWindow}>{this.state.expanded ? '>' : '<'}</button>
            </div>
        )
    }
}

export default MapFilter;