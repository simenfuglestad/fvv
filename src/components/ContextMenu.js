import React, { Component } from 'react';

class ContextMenu extends Component {
    constructor(props) {
        super(props);

    }

    render(){
        let left = this.props.x + 'px';
        let top = this.props.y + 'px';

        return(
            <div className='ContextMenu' style={{left,top}}>
                <button onClick={this.props.handleClick}>Hendelse</button>
            </div>
        )
    }
}

export default ContextMenu;

