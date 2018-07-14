import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import Particles from 'react-particles-js';
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
  render() {
    return (
      <div className="App">
          <Particles className='particles'
              params={particlesOptions}
          />
        <Navigation />
          <Logo/>
          <Rank/>
          < ImageLinkForm />
          {
              /*
              < FaceRecognition / >*/
          }
      </div>
    );
  }
}

export default App;
