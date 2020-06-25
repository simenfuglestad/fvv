import React, { Component } from 'react'
import { ReactComponent as AddObject } from './../assets/untitled.svg'
// import {StyleSheet} from 'react-native'

class PlaceObjectBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div borderRadius="25px">
        <AddObject
          id="placeObjectBtn"
          onClick = {this.props.handleBtnClick}>
        </AddObject>
      </div>
    );
  }


}
export default PlaceObjectBtn;
