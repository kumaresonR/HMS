import React from 'react';
import AllRouter from './Routes/allRoutes';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/scss/themes.scss';
import 'react-phone-number-input/style.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-quill/dist/quill.snow.css';

function App() {
  return (
    <React.Fragment>
      <ToastContainer containerId={'TR'} />
      <ToastContainer containerId={'BC'} />
      <AllRouter />
    </React.Fragment>
  );
  
}

export default App;
