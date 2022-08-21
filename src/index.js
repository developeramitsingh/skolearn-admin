import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "core-js/features/string/repeat";
import React from "react";
import ReactDOM from "react-dom";
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
//import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
ReactDOM.render(
  <Router><App /></Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();