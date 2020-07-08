import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class UserPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData : null,
      isOpen : true
    }

    this.handleTakePhotoAnimationDone=this.handleTakePhotoAnimationDone.bind(this);
    this.handleConfirmPhoto=this.handleConfirmPhoto.bind(this);
    this.handleRedoPhoto=this.handleRedoPhoto.bind(this);
    this.handleCancelPhoto=this.handleCancelPhoto.bind(this);
  }


  handleTakePhotoAnimationDone(imgData) {
    this.setState({
      isOpen : false,
      imgData : imgData
    })
  }

  handleConfirmPhoto(event) {
    this.props.closeCameraView(this.state.imgData);
  }

  handleRedoPhoto(event) {
    this.setState({isOpen : true})
  }

  handleCancelPhoto(event) {
    this.props.closeCameraView(null);
  }

  render() {
    if(this.state.isOpen) {
      return (
        <div className="CameraView">
          <Camera
            isFullscreen={true}
            onTakePhotoAnimationDone={this.handleTakePhotoAnimationDone}
            onTakePhoto={this.handleTakePhoto}
            idealResolution={{width : 1920, height : 1080}}
            isMaxResolution={false}
          />
          <input
            type="button"
            value="Avbryt"
            className="CancelPhotoButton"
            onClick={this.handleCancelPhoto}/>
        </div>
      );
    } else {
      return (
        <div className="PhotoPreview">
          <div >
            <img src={this.state.imgData}/><br></br>
            <input
              type="button"
              value="Bekreft Bilde"
              className="ConfirmPhotoButton"
              onClick={this.handleConfirmPhoto}>
            </input>
            <input
              type="button"
              value="Ta Nytt"
              className="RedoPhotoButton"
              onClick={this.handleRedoPhoto}>
            </input>
            <input
              type="button"
              value="Avbryt"
              className="CancelPhotoButton"
              onClick={this.handleCancelPhoto}/>
          </div>
        </div>
      )
    }
  }
}

export default UserPhoto;
