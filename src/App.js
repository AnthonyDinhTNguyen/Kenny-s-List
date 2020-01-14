import React from 'react';
import './App.css';
import Amplify, { Auth, Hub } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div id="routeDiv">
        <Switch>
          <Route path="/test">
            <Test />
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

export default App;
