import React, { useContext } from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { init, locations } from '@contentful/app-sdk'
import { AppContextProvider } from './context';

import './index.css'
import '@contentful/forma-36-react-components/dist/styles.css'
import '@contentful/forma-36-fcss/dist/styles.css'

init((sdk) => {

  if (sdk.location.is(locations.LOCATION_PAGE)) {

    // Main app render and pass SDK as prop
    ReactDOM.render(
      <React.StrictMode>
        <AppContextProvider sdk={sdk}>
          <App />
        </AppContextProvider>
      </React.StrictMode>,
      document.getElementById('root')
    )

  } else {
    return null
  }
})