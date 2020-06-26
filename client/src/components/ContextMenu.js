import React, { Component } from 'react';

class ContextMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
          left : 0,
          top  : 0,
        }
    }

    render(){
        let left = this.props.details.x + 'px';
        let top = this.props.details.y + 'px';
        console.log(left);

        return(
            <div className='ContextMenu' style={{left,top}}>
                <button onClick={this.props.handleClick}>Hendelse</button>
                <button>Nytt objekt</button>
            </div>
        )
    }
}

export default ContextMenu;
