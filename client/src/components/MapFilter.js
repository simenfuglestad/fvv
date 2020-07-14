import React, { Component } from 'react';

class MapFilter extends Component {
    constructor(props){
        super(props)
        this.state = {
            hasPolygon: false,
        }
        this.colorScheme = ['#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#ffff99','#cab2d6','#fdbf6f','#fb9a99','#b2df8a','#a6cee3']
        
        this.polygonFilter = this.polygonFilter.bind(this);
    }

    render(){
        return(
            <div className='mapFilter'>
                {this.props.filters.length > 0 && <div>Vegobjekter</div>}
                {this.props.filters.length > 0 && this.showFilters()}
                <button className='mapfilter-areabutton' onClick={this.polygonFilter}>{this.state.hasPolygon ? 'Fjern områdefilter' : 'Lag områdefilter'}</button>                
            </div>
        );
    }

    showFilters(){
        let filters = [...this.props.filters]
        filters.sort((a,b) => {
            if(a.id < b.id){
                return -1;
            }
            if(a.id > b.id){
                return 1;
            }
            return 0;
        })

        return(

            this.props.filters.map((item) => {
                const idIndex = filters.findIndex((filter) => (
                    filter.id === item.id
                ));
                const backgroundColor = this.colorScheme[idIndex%this.colorScheme.length];
                return(
                    <div className='mapFilter-entry'  key={item.id}>
                        <div className='mapfilter-entry-colorbox' style={{backgroundColor}}></div>
                        <div className='mapFilter-entry-name'>{item.navn}</div>
                        <button className='mapFilter-entry-button' onClick={() => {this.props.handleRemoveFilter(item)}}>X</button>
                    </div>
                )
            })
        )
    }

    polygonFilter(){
        this.props.togglePolyFilter(this.state.hasPolygon);
        this.setState((prevState) => ({
            hasPolygon: !prevState.hasPolygon
        }))
    }
}

export default MapFilter;