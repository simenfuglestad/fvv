import React, { Component } from 'react';

class MapView extends Component {
    constructor(props) {
      super(props);
    }

    render(){
        return(
            this.props.active ? <div></div> : <div></div>
        )

    }
}