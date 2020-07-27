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
    this.handleEnterLogin = this.handleEnterLogin.bind(this);
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

  handleLogin() {
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

  handleEnterLogin(e) {
    if(e.charCode === 13) {
      this.handleLogin();
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
                placeholder="Passord"
                onKeyPress={this.handleEnterLogin}></input>
        <br/>
        <button onClick={this.handleLogin} value="submit">{"submit"}</button>
      </div>
    )
  }
}

export default LoginView;
