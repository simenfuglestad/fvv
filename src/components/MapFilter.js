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
        this.addMunicipalityFilter = this.addMunicipalityFilter.bind(this);
        this.removeMunicipalityFilter = this.removeMunicipalityFilter.bind(this);
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

    addMunicipalityFilter(item){
        this.setState(prevState => {
            this.props.handleFilters(prevState.municipalities.concat(item));
            return{municipalities: prevState.municipalities.concat(item)};  
        });
        
    }

    removeMunicipalityFilter(item){
        this.setState(prevState => {
            this.props.handleFilters(prevState.municipalities.filter((i) => i !== item));
            return{municipalities: prevState.municipalities.filter((i) => i !== item)};
        });
    }

    render(){
        return(
            <div className='mapfilter-container' style={{height: this.state.height, width: this.state.width}}>
                {this.state.expanded &&
                <DropDown
                    title='Velg kommune'
                    list={this.props.data}
                    selected={this.state.municipalities}
                    addFilter={this.addMunicipalityFilter}
                    removeFilter={this.removeMunicipalityFilter}
                />}
                {this.state.expanded && 
                <DropDown
                    title='Velg vegobjekt'
                    list={[]}
                    selected={this.state.roadObjects}
                />}
                <button className='mapfilter-toggle' onClick={this.toggleWindow}>{this.state.expanded ? '>' : '<'}</button>
            </div>
        )
    }
}

export default MapFilter;