import React, { Component } from 'react'
import AddObject from './../assets/AddObject.png'

function PlaceObjectBtn(props) {
  return (
      <img src = {AddObject} onClick={props.handleBtnShowContext} id="placeObjectBtn"/>
  )
}
export default PlaceObjectBtn;
