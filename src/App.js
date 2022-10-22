import './App.css';
import React, { useState } from 'react';
import Login from './layouts/login/login';
import { useHistory, Switch, Route } from 'react-router-dom';
import { historyState } from "./constant/global";
import LiveChat from './layouts/liveChat/liveChat';
import Home from './layouts/home/home';

function App(props) { 
  const history = useHistory()
  console.info(history);

  historyState.history = history;

  return (
    <div className="App">
          <Switch>
            <Route exact path ="/admin/liveChat">
              <LiveChat/>
            </Route>

            <Route exact path ="/admin/home">
              <Home/>
            </Route>

            <Route exact path ="/">
              <Login/>
            </Route>
          </Switch>
    </div>
  );
}

export default App;
