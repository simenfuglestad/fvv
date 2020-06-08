import React, { Component } from 'react';
import DropDown from './DropDown';


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meny: 'MainMenu',
            chosenMunicipalities: [],
            chosenRoadObjects: [],
        }

        this.choices = this.choices.bind(this);
    }

    choices(kommune){
        console.log(this);
        this.state.chosenMunicipalities.push(kommune);
        this.props.onClick(kommune.nummer);
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
                     onClick={this.choices}
                    /> 
                    : 'Fetching data...'}

                    {
                        this.state.chosenMunicipalities.map((item) => {
                            return(
                                <div>{item.navn}</div>
                            )
                        })
                    }        
                </div>
            );
        }
        
    }

    
}

export default Menu;