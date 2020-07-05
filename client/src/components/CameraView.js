import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class UserPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData : null,
      isOpen : true,
    }

    this.handleTakePhoto=this.handleTakePhoto.bind(this);
    this.handleCameraStop=this.handleCameraStop.bind(this);
    this.handleCameraStart=this.handleCameraStart.bind(this);
    this.handleTakePhotoAnimationDone=this.handleTakePhotoAnimationDone.bind(this);
    this.handleConfirmPhoto=this.handleConfirmPhoto.bind(this);
    this.handleRedoPhoto=this.handleRedoPhoto.bind(this);
  }

  handleTakePhoto(imgData) {
    console.log("test photo");
  }

  handleCameraStop(event) {
    console.log("cam stop");
  }

  handleCameraStart(event) {
    console.log("cam start");
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
    console.log("redo photo");
  }

  render() {
    if(this.state.isOpen) {
      return (
        <div className="cameraView">
          <Camera
            isFullScreen={this.props.isFullScreen}
            onCameraStart={this.handleCameraStart}
            onCameraStop={this.handleCameraStop}
            onTakePhotoAnimationDone={this.handleTakePhotoAnimationDone}
            onTakePhoto={this.handleTakePhoto}
          />
        </div>
      );
    } else {
      return (
        <div className="PhotoPreview">
          <img src={this.state.imgData}/><br></br>
          <input type="button"
                 value="Bekreft Bilde"
                 className="confirmPhotoButton"
                 onClick={this.handleConfirmPhoto}>
          </input>
          <input type="button"
                 value="Ta Nytt"
                 className="RedoPhotoButton"
                 onClick={this.handleRedoPhoto}>
          </input> <br></br>
        </div>
      )
    }
  }
}

export default UserPhoto;
