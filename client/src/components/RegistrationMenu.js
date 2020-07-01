import React, {Component } from 'react';

class RegistrationMenu extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="regMenu">
        <div className="regForm">
          <label>Objekttype</label>
          <input className="regFormUserInput" type="text"></input><br/>
          <div className="regPosSubDiv">
            <label>Posisjon</label>
            <span>(</span>
            <input type="text"></input>
            <span>,</span>
            <input type="text"></input>
            <span>)</span>
            <input type="button" value="Hent din posisjon"/>
          </div>


          <label>ID</label>
          <input className="regFormUserInput" type="text"></input> <br/>

          <label>Siste kontroll</label>
          <input className="regFormUserInput" type="text"></input><br/>

          <label>Merknad</label>
          <input className="regFormUserInput" type="text"></input><br/>

          <input type="button" value="Fullfør registrering" onClick={this.props.handleFinishReg}/>
        </div>

      </div>
    )
  }
}

export default RegistrationMenu;
