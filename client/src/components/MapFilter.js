import React, { Component } from 'react';
import ColorPicker from './ColorPicker';

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
        return(
            this.props.filters.map((item) => {
                const backgroundColor = ColorPicker.get(item.id);
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