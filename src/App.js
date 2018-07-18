import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/signIn/SignIn';
import Register from './components/registration/Registration';
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
const initialState = {
    input: '',
    imgUrl: '',
    box: {},
    route: 'signIn',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
} 

class App extends Component {

    constructor() {
        super();
        this.state = initialState;
    }

     loadUser = (data) => {
      this.setState({user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }
      })
    }

    calculateBox = (box) => {
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
            fetch('https://frozen-forest-54963.herokuapp.com/imageurl',{
                        method: 'post',
                        headers:{
                            'Content-type':' application/json'
                        },
                        body: JSON.stringify({
                            input: this.state.input
                        })
            })
            .then(response => response.json())
            .then(response => {
                if(response){
                    fetch('https://frozen-forest-54963.herokuapp.com/image',{
                        method: 'put',
                        headers:{
                            'Content-type':' application/json'
                        },
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                    .then(resp => resp.json())
                    .then(count => this.setState(Object.assign(this.state.user,{entries: count})))
                    .catch(err => console.log)
                }
                this.calculateBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err))

    }

    onRouteChange = (route) => {
        if( route ==='home') {
            this.setState({isSignedIn: true})
        } else if(route ==='signOut') {
            this.setState(initialState);
        }
        this.setState({route});
    }

    render() {
    return (
      <div className="App">
          <Particles className='particles'
              params={particlesOptions}
          />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}

        />
          {
              this.state.route ==='home'
              ?
                  <div>
                      <Logo/>
                      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                      < ImageLinkForm onInputChange={this.onInputChange}
                                      onSubmit={this.onSubmit} />
                      <FaceRecognition imgUrl={this.state.imgUrl}
                                       box={this.state.box}
                      />
                  </div>
              :
                  (
                  this.state.route ==='signIn' ?  <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                  )

          }

      </div>
    );
  }
}

export default App;
