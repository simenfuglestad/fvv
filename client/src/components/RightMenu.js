import React, { Component } from 'react';
import SearchField from './SearchField';
import MapFilter from './MapFilter';
import DataDisplay from './DataDisplay';

class RightMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
        }

        this.handleFilterSelect = this.handleFilterSelect.bind(this);
        this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    }

    render(){
        return(
            <div className='rightMenu'>
                <SearchField handleFilterSelect={this.handleFilterSelect} data={this.props.roadObjectTypes}/>
                <MapFilter 
                    filters={this.state.filters} 
                    handleRemoveFilter={this.handleRemoveFilter}
                    togglePolyFilter = {this.props.togglePolyFilter}
                />
                
                {this.props.showMarkerInfo && 
                    <DataDisplay   
                    showMarkerInfo={this.props.showMarkerInfo}
                    handleClickOutside={this.props.handleClickOutside}
                    />
                }
            </div>
        )
    }

    handleFilterSelect(item){
        const newFilters= this.state.filters.concat(item);
        this.props.handleFilters(newFilters)
        this.setState(() => {
            return{filters: newFilters}
        })
        
    }

    handleRemoveFilter(item){
        const newFilters = this.state.filters.filter(f => f !== item);
        this.props.handleFilters(newFilters)
        this.setState(() => {
            return{filters: newFilters}
        })
    }
}

export default RightMenu;