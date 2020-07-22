import React, { Component } from 'react';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredUsername : "",
      enteredPassword : "",
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUserNameChange(event) {
    const val = event.target.value;
    this.setState(prevState => ({
      enteredUsername : val,
      enteredPassword : prevState.enteredPassword
    }));
  }

  handlePasswordChange(event) {
    const val = event.target.value;
    this.setState(prevState => ({
      enteredUsername : prevState.enteredUsername,
      enteredPassword : val
    }));
  }

  handleLogin(event) {
    if(this.state.enteredUsername === "") {
      alert("Skriv inn Brukernavn");
    }
    else if (this.state.enteredPassword === "") {
      alert("Skriv inn Passord");
    } else {
      this.props.handleLogin(this.state)
      this.setState({
        enteredUsername : "",
        enteredPassword : "",
      })
    }
  }

  render() {
    return (
      <div className="LoginView">
        <input  onChange={this.handleUserNameChange}
                value={this.state.enteredUsername}
                type="text"
                placeholder="Brukernavn"></input>
        <br/>
        <input  onChange={this.handlePasswordChange}
                value={this.state.enteredPassword}
                type="password"
                placeholder="Passord"></input>
        <br/>
        <button onClick={this.handleLogin} value="submit">{"submit"}</button>
      </div>
    )
  }
}

export default LoginView;
