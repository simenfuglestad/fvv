import React, { Component } from 'react';
import SearchField from './SearchField';
import MapFilter from './MapFilter';
import DataDisplay from './DataDisplay';
import PlaceObjectBtn from './PlaceObjectBtn';

class RightMenu extends Component {
    constructor(props) {
        super(props)

        this.handleFilterSelect = this.handleFilterSelect.bind(this);
        this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
    }

    render(){
        return(
            <div className='rightMenu'>
                <SearchField handleFilterSelect={this.handleFilterSelect} data={this.props.roadObjectTypes}/>
                <MapFilter 
                    filters={this.props.filters} 
                    handleRemoveFilter={this.handleRemoveFilter}
                    togglePolyFilter = {this.props.togglePolyFilter}
                />
                
                {this.props.showMarkerInfo && 
                    <DataDisplay   
                    showMarkerInfo={this.props.showMarkerInfo}
                    handleClickOutside={this.props.handleClickOutside}
                    />
                }
                <PlaceObjectBtn handleBtnClick={this.handleBtnClick}></PlaceObjectBtn>
            </div>
        )
    }

    handleFilterSelect(item){
        const newFilters= this.props.filters.concat(item);
        this.props.handleFilters(newFilters)
    }

    handleRemoveFilter(item){
        const newFilters = this.props.filters.filter(f => f !== item);
        this.props.handleFilters(newFilters)
    }

    handleBtnClick(event) {
      this.props.handleBtnShowContext(event);
      console.log("test handleBtn");
    }
}

export default RightMenu;
