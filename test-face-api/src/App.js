import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import WebCamPicture from './components/WebCamPicture.js';
import Expression from './components/Expression.js';

const MODEL_URL = '/models';
const displaySize = { width: 350, height: 350 };
const minConfidence = 0.1;
const DELAY = 33;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullFaceDescription: undefined,
      modelsLoaded: false,
    };
    this.canvas = React.createRef();
  }

  async componentDidMount() {
    console.log('haaa');
    await this.loadModels();
    this.setState({
      modelsLoaded: true,
    });
  }

  async loadModels () {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  }

  getFullFaceDescription = async (canvas) => {
    this.setState({
      fullFaceDescription:
        await faceapi.detectSingleFace(
          canvas,
          new faceapi.SsdMobilenetv1Options({ minConfidence }),
        ).withFaceLandmarks().withFaceExpressions(),
    });
  }

  drawDescription = (canvas) => {
    if (!this.state.fullFaceDescription) return;
    const resizedResults = faceapi.resizeResults([this.state.fullFaceDescription], displaySize);
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
  }

  landmarkWebCamPicture = (picture) => {
    const ctx = this.canvas.current.getContext("2d");
    var image = new Image();
    image.onload = async () => {
      ctx.drawImage(image, 0, 0);
      await this.getFullFaceDescription(this.canvas.current);
      // this.drawDescription(this.canvas.current);
    };
    image.src = picture;
  }

  render() {
    const { modelsLoaded, fullFaceDescription } = this.state;
    return (
      <div className="App" >
        { modelsLoaded &&
          <WebCamPicture landmarkPicture={this.landmarkWebCamPicture} auto={DELAY} /> }
        { fullFaceDescription &&
          <Expression expressions={this.state.fullFaceDescription.expressions} /> }
        <canvas ref={this.canvas} {...displaySize} />          
      </div>
    );
  }
}
