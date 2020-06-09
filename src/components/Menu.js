import React, { Component } from 'react';
import DropDown from './DropDown';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meny: 'MainMenu',
        }
    }

    render(){

        if(this.state.meny === 'MainMenu'){
            return(
                <div className='Menu'>
                    <header>Hoved Meny</header>
                    <button onClick={() => {this.setState({meny: 'Mapfilter'})}}>Filter valg</button>
                    <button>Registrer objekt</button>
                </div>
            );

        } else if(this.state.meny === 'Mapfilter'){
            return (
                <div className='Menu'>
                    <button className='backButton' onClick={() =>{this.setState({meny: 'MainMenu'})}}>tilbake</button>
                    {this.props.data ? 
                     <DropDown
                     title='Velg kommune'
                     list={this.props.data}
                     handleFilters={this.props.handleFilters}
                    /> 
                    : 'Fetching data...'}     
                </div>
            );
        }
        
    }

    
}

export default Menu;