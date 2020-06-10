import React, { Component } from 'react';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meny: 'MainMenu',
            vegobjekter: []
        }
    }

    render(){

        if(this.state.meny === 'MainMenu'){
            return(
                <div className='Menu'>
                    <header>Hoved Meny</header>
                    <button>Registrer objekt</button>
                    <button onClick={this.props.getNearbyData}>Test lokasjonsfiltrering</button>
                </div>
            );

        }
        
    }

    
}

export default Menu;