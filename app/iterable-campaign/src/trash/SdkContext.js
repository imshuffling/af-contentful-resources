import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SDK from './SdkContext';

import { init, locations } from '@contentful/ui-extensions-sdk'
// import reportWebVitals from './reportWebVitals';

// For local dev only
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

init((sdk) => {
  if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {

    // Enable auto resize
    sdk.window.startAutoResizer()



    // set SDK as context
    const ThemeContext = React.createContext(sdk);

    // console.log('ThemeContext', ThemeContext);

    // Main app render and pass SDK as prop
    ReactDOM.render(
      <React.StrictMode>
        <ThemeContext.Provider value={sdk}>
          <App sdk={sdk} />
        </ThemeContext.Provider>
      </React.StrictMode>,
      document.getElementById('root')
    )

  } else {
    return null
  }
});