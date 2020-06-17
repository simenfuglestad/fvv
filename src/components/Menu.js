import React, { Component } from 'react';
import IssueRegistration from './IssueRegistration';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainMenu: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        // Any time props.email changes, update state.
        if (nextProps.issueRegistration !== this.props.issueRegistration) {
          this.setState({
            issueRegistration: nextProps.issueRegistration
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
                        <button onClick={() => {this.setState({issueRegistration: true})}}>Registrer hendelse</button>
                    </div>
                }
                {this.state.issueRegistration && <IssueRegistration/>}
                
            </div>
        );
    }
}

export default Menu;