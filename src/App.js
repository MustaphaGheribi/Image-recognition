import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/signIn/SignIn';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';


const app = new Clarifai.App({
    apiKey: 'a76d8ef357094228958437b52a77a0d4'
});
const particlesOptions = {
    particles: {
       number: {
           value:100,
           density: {
               enable: true,
               value_area: 1000
           }
       },
        onhover: {
           enable: true,
            mode: 'repulse'
        }
    }
};

class App extends Component {

    constructor() {
        super();
        this.state =  {
            input: '',
            imgUrl: '',
            box: {}
        }
    }

    calculateBox = (box) => {
        console.log(box);
        this.setState({box});
    }

    calculateFaceLocation = (data) => {
        const box_bound = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('imageinput');
        const height = Number(image.height);
        const width = Number(image.width);
        return {
            left_col: box_bound.left_col * width,
            top_row: box_bound.top_row * height,
            right_col: width - (box_bound.right_col * width),
            bottom_row: height - (box_bound.bottom_row * height)
        }
    }


    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onSubmit = () => {
        this.setState({imgUrl: this.state.input});
        app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(response => this.calculateBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err))

    }

    render() {
    return (
      <div className="App">
          <Particles className='particles'
              params={particlesOptions}
          />
        <Navigation />
          <SignIn/>
          <Logo/>
          <Rank/>
          < ImageLinkForm onInputChange={this.onInputChange}
                          onSubmit={this.onSubmit} />
          <FaceRecognition imgUrl={this.state.imgUrl}
                           box={this.state.box}
          />
      </div>
    );
  }
}

export default App;
