import React, { Component } from 'react';
import RightMenu from './RightMenu';

//Currently not in use
class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className='Menu'>
                <RightMenu/>
            </div>
        );
    }
}

export default Menu;