import React, { Component } from 'react';
import CaseRegistration from './CaseRegistration';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainMenu: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        // Any time props.email changes, update state.
        if (nextProps.caseRegistration !== this.props.caseRegistration) {
          this.setState({
            caseRegistration: nextProps.caseRegistration
          });
        }
      }

    render(){
        return(
            <div className='Menu'>
                {this.state.mainMenu && 
                    <div className='main-menu'>
                        <header>Hoved Meny</header>
                        <button>Registrer objekt</button>
                        <button onClick={() => {this.setState((prevstate) => ({caseRegistration: !prevstate.caseRegistration}))}}>Registrer sak</button>
                    </div>
                }
                <CaseRegistration show={this.state.caseRegistration} point={this.props.latlng} handleRegistration={this.props.handleRegistration}/>
                
            </div>
        );
    }
}

export default Menu;