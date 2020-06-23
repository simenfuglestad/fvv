import React, { Component } from 'react';

class MapFilter extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            this.props.filters.length > 0 ?
            <div className='mapFilter'>
                <div>Vegobjekter</div>
                    {
                    this.props.filters.map((item) => (
                            <div className='mapFilter-entry' key={item.id}>
                                <div className='mapFilter-entry-name'>{item.navn}</div>
                                <button className='mapFilter-entry-button' onClick={() => {this.props.handleRemoveFilter(item)}}>X</button>
                            </div>
                        ))
                    }
                <div>Filtrer..</div>                
            </div>
            :
            <div></div>
        );
    }
}

export default MapFilter;