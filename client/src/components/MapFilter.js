import React, { Component } from 'react';

class MapFilter extends Component {
    constructor(props){
        super(props)
        this.colorScheme = ['#1f78b4','#33a02c','#e31a1c','#ff7f00','#6a3d9a','#b15928','#ffff99','#cab2d6','#fdbf6f','#fb9a99','#b2df8a','#a6cee3']
    }

    render(){
        return(
            this.props.filters.length > 0 ?
            <div className='mapFilter'>
                <div>Vegobjekter</div>
                    {
                    this.props.filters.map((item) => {
                        const idIndex = this.props.filters.findIndex((filter) => (
                            filter.id === item.id
                        ));
                        const backgroundColor = this.colorScheme[idIndex%this.colorScheme.length];
                        return(
                            <div className='mapFilter-entry'  key={item.id}>
                                <div className='mapfilter-entry-colorbox' style={{backgroundColor}}></div>
                                <div className='mapFilter-entry-name'>{item.navn}</div>
                                <button className='mapFilter-entry-button' onClick={() => {this.props.handleRemoveFilter(item)}}>X</button>
                            </div>
                        )})
                    }
                <div>Filtrer..</div>                
            </div>
            :
            <div></div>
        );
    }
}

export default MapFilter;