import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { init, locations } from '@contentful/app-sdk'

import './index.css'
import '@contentful/forma-36-react-components/dist/styles.css'
import '@contentful/forma-36-fcss/dist/styles.css'

// For local dev only
// ReactDOM.render(
//   <React.StrictMode>
//     <App sdk={{ object: "object" }} />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

init((sdk) => {
  if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {

    // Enable auto resize
    sdk.window.startAutoResizer()

    // Main app render and pass SDK as prop
    ReactDOM.render(
      <React.StrictMode>
        <App sdk={sdk} />
      </React.StrictMode>,
      document.getElementById('root')
    )

  } else {
    return null
  }
})