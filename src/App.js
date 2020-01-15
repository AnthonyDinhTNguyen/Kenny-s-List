// src/App.js

// import useEffect hook
import React, { useEffect } from 'react';
// import Hub
import Amplify, { Auth, Hub } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

async function checkUser() {
  return (await Auth.currentAuthenticatedUser());
}

function signOut() {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}
class App extends React.Component {
  constructor() {
    super();
    this.state = {user: null};
    
    Hub.listen('auth', (data) => {
        const { payload } = data;
        this.onAuthEvent(payload);
        console.log('A new auth event has happened: ', data);
      })
  }
  
  onAuthEvent(payload) {
    if (payload.event === 'signIn') {
      console.log('a user has signed in!')
    }
    if (payload.event === 'signOut') {
      console.log('a user has signed out!')
    }
  }
  
  async componentDidMount() {
      const res = await checkUser();
      console.log("User is " + JSON.stringify(res));
      this.setState({user: res});
  }
  
  render() {
    return (
      <Router>
        <div id="routeDiv">
          <Switch>
            <Route path="/test">
              <Test1 />
            </Route>
            <Route path="/test2">
              <Test2 />
            </Route>
            <Route path="/">
              <Home />
            </ Route>
          </Switch>
        </div>
      </Router>
    );
  }  
}
  function Home() {
    return (
      <div className="App">
        <header className="App-header">
          <body>
            Fill in files using the established React Components.
          </body>
        </header>
      </div>
    );
  }
  
  function Test1() {
     return (
       <div>
         This is Test1.
       </div>
     );
  }
  
  function Test2() {
     return (
       <div>
         This is Test2.
       </div>
     );
  }



export default App
