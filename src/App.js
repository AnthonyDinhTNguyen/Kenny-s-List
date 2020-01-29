// import useEffect hook
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {createStore } from 'redux';
import rootReducer from './reducers';

// import Hub
import Amplify, { Auth, Hub } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from "./components/Pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProductDetail from "./components/Pages/ProductDetailPage/ProductDetailPage";
export const  store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
Amplify.configure({
  Auth: {
    IdentityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3',
    region: 'us-east-1',
    userPoolId: 'us-east-1_buFSrhliB',
    userPoolWebClientId: '1qkrcfqgqv63hk594qi92q5hqi',
    mandatorySignIn: true,
    oauth: {
      domain: 'kennyslist.auth.us-east-1.amazoncognito.com',
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
      redirectSignOut: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
      responseType: 'token'
    }
  }
});

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
    if (this.state.user == null) {
      return (
        <div>
          <Login/>
        </div>
      );
    } else { 
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
                <Main />
              </ Route>
            </Switch>
          </div>
        </Router>
      );
    } 
  } 
}
  function Main() {
    return (
      <Provider store={store}>
            <Router>
            <React.Fragment>
                <Header/>
                <Switch>
                    <Route exact path={'/'} render={() => {
                        return <Redirect to={'/products'}/>
                    }}/>
                    <Route exact path={'/products'} component={Home}/>
                    <Route exact path={'/products/:id'} component={ProductDetail}/>
                </Switch>
                <Footer/>
            </React.Fragment>
            </Router>
        </Provider>
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

  function Login() {
    return (
      <div id="login-page" className="app">
        <div id="login-page" className="app-header">
          <div className="App">
            <header className="App-header">
              <button id="SignInButton" onClick={() => Auth.federatedSignIn()}>Sign In</button>
            </header>
          </div>
        </div>
      </div>
    );
  }

export default App;
