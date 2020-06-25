import React, { Component } from 'react'

class PlaceObjectBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <button onClick = {this.props.handleBtnClick}
              type="button"
              id="placeObjectBtn">
        Legg til Objekt/Hendelse
      </button>
    )
  }
}
export default PlaceObjectBtn;
