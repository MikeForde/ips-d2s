import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { PatientProvider } from './PatientContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


ReactDOM.render(
  <PatientProvider>
    <App />
  </PatientProvider>,
  document.getElementById('root')
);
