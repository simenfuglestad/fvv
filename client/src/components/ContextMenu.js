import React, { Component } from 'react';

class ContextMenu extends Component {
    constructor(props) {
        super(props);

    }

    render(){
        let left = this.props.details.x + 'px';
        let top = this.props.details.y + 'px';

        return(
            <div className='ContextMenu' style={{left,top}}>
                <button onClick={this.props.handleClick}>Hendelse</button>
                <button>Nytt objekt</button>
            </div>
        )
    }
}

export default ContextMenu;

