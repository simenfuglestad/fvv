import React, {Component } from 'react';

class RegistrationMenu extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="regMenu">
        <form>
          <label for="test1">test1</label>
          <input type="text"></input>
        </form>
      </div>
    )
  }
}

export default RegistrationMenu;
