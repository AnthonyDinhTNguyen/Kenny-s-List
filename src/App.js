// import useEffect hook
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {createStore } from 'redux';
import rootReducer from './reducers';

// import Hub
import Amplify, { Auth, Hub,Storage } from 'aws-amplify';
import API, {graphqlOperation} from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
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
import AddItem from "./components/Pages/AddItem/AddItem";
import CheckOutPage from "./components/Pages/CheckOutPage/CheckOutPage";
import Profile from "./components/Pages/Profile/Profile";

export const  store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
import awsconfig from "./aws-exports";
API.configure(awsconfig);
PubSub.configure(awsconfig);
Amplify.configure({
  Auth: {
      identityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3',
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
    },
  Storage: {
      AWSS3: {
          bucket: 'kennyslist0a68ad13e69142fb89779b2dba58e9dd145823-kennyslist', //REQUIRED -  Amazon S3 bucket
          region: 'us-east-1', //OPTIONAL -  Amazon service region
          identityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3'
      }
  },
  API: {
  	aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: "da2-5ze6sharjrbklo5xrf4r5r5cnq"
  }
});
Storage.configure({
  bucket:'kennyslist0a68ad13e69142fb89779b2dba58e9dd145823-kennyslist',
  level: 'public',
  region:'us-east-1',
  identityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3'
});

async function checkUser() {
  return (await Auth.currentAuthenticatedUser());
}

function signOut() {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

class App extends Component {

  constructor() {
    super();
    this.state = {user: null};
    
    Hub.listen('auth', (data) => {
        const { payload } = data;
        this.onAuthEvent(payload);
        console.log('A new auth event has happened: ', data);
      })
  };
  
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
      Auth.currentSession().then(data => console.log(data)).catch(err => console.log(err));
      this.setState({user: res});
      const result = await Auth.currentSession();
      AWS.config.region ='us-east=1';
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:452e5811-58e7-4cce-8b39-90db30a8eba3',
        Logins: {
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_buFSrhliB': result.getIdToken().getJwtToken()
        }
      });
      AWS.config.credentials = Auth.essentialCredentials(await Auth.currentCredentials());
  }

  render() {
    if (this.state.user == null) {
      return Auth.federatedSignIn();
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
};
  
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
                    <Route exact path={'/additem'} component={AddItem}/>
                    <Route exact path={'/cart'} component={CheckOutPage}/>
                    <Route exact path={'/profile'} component={Profile}/>
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
      <div className="app">
        <div className="app-header">
          <h1>Welcome to KennysList</h1>
        </div>
        <div className="app">
          <header className="app-header">
            <button id="SignInButton" onClick={() => Auth.federatedSignIn()}>Sign In</button>
        </header>
      </div>    
    </div>
    );
  }

export default App;
