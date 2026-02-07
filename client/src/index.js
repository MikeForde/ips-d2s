import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { PatientProvider } from './PatientContext';
import 'react-native-get-random-values';


ReactDOM.render(
  <PatientProvider>
    <App />
  </PatientProvider>,
  document.getElementById('root')
);
