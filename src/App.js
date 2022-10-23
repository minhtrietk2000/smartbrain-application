
import './App.css';
import React, { useCallback,useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const particleOptions = {
  particles: {
    number: {
      value: 416,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#FFFFFF"
    },
    shape: {
      type: 'circle',
      polygon: {
        nb_sides: 4
      }
    },
    opacity: {
      value: 0.62,
      random: true
    },
    size: {
      value: 8,
      random: true
    },
    move: {
      enable: true,
      direction: 'bottom',
      random: true,
      speed: 5,
      out_mode: 'out'
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  },
  interactivity: {
    onhover: {
      enable: true,
      mode: 'bubble'
    },
    onclick: {
      enable: true,
      mode: 'repulse'
    },
    modes: {
      detect_on: 'window'
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

function App() {

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);
  //State- variables
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id : '',
    name : '',
    email : '',
    entry : 0,
    joined : new Date()
  })

  const [stateApp, setStateApp] = useState(initialState);
  

   const onInputChange = (e) => {
    setInput(e.target.value);
    console.log(e.target.value);
     }

   const onRouteChange = (route) => {

    if (route === 'signout') {
        setIsSignedIn(isSignedIn);
    } else if (route === 'home') {
        setIsSignedIn(!isSignedIn);
    }

    setRoute(route);
   }

   const loadUser = (data) => {
      setUser({
        id : data.id,
        name : data.name,
        email : data.email,
        entries : data.entries,
        joined : data.joined
      })
   }

   const calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.querySelector('#inputImage');
      const width = Number(image.width);
      const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

   }
   
   const displayFaceBox = (box) => {
      console.log(box);
      setBox(box);
   }
     
   
   const onSubmit = (e) =>  {
      const raw = JSON.stringify({
      user_app_id: {
        user_id: "clarifai",
        app_id: "main"
      },
      inputs: [
        {
          data: {
            image: {
              url : input
            }
          }
        }
      ]
     });
     
     const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key 2d710a2fc0884ffeb92d346e12f06d21'
      },
      body: raw
    }
    setImageUrl(input);
    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result) {
        fetch('http://localhost:3000/image', {
          method : 'PUT',
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify({
            id : user.id
          })
        })
        .then (response => response.json())
        .then (count => {
          setUser({
            ...user,
            entry : count
          })
        })
      } else {
        console.log('error');
      }

      displayFaceBox(calculateFaceLocation(result))
    })
    .catch(error => console.log('error', error));

    console.log('clicked');
   } 
     
  return (
    <div className="App">
      <Particles
        id='tsparticles'
        init={particlesInit}
        loaded={particlesLoaded}
        options={particleOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home'
        ?
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
  	      <ImageLinkForm onButtonSubmit={onSubmit} onInputChange={onInputChange} />
  	      <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>

        : (
            route === 'signin' ?
            <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
              :
            <Register loadUser={loadUser} onRouteChange={onRouteChange} />  
          )
  	    
        
      }
    </div>
  );
}

export default App;
