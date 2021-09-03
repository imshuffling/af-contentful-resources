import React, { useState } from 'react'
import { init, locations } from '@contentful/app-sdk'

export const AppContext = React.createContext()

export const AppContextProvider = ({ sdk, children }) => {

  // const initialQuery = {
//   "query": {
//     "content_type": null,
//     "limit": 4,
//     "fields": []
//   },
//   "change": {
//     "fields": []
//   }
// }

  const initialEntryQuery = {
    "content_type": null,
    "limit": 1000
    // "fields": [],
    // "fields.title": "Compounding X-ray Profits: A Guide to COVID-19",
    // "fields.title": "Compounding X-ray Profits: A Guide to",
    // "fields.title[exists]": true,
    // ['fields.title']: 'Compounding X-ray Profits: A Guide to Rollovers'
    // "sys.id": "3cGnVZoSysTvOjKyoNkkIm"
  }

  const initialEntryUpdate = {
    "fields": []
  }

  const [entryQuery, setEntryQuery] = useState(initialEntryQuery)
  console.log('entryQuery', entryQuery);





  const handleUpdateEntryQuery = (key = '', value = '', remove = false) => {

    // Required params
    if (!key) return
    if (!value && !remove) return

    setEntryQuery( prevState => {

      // Update query with key/value pair
      if (!remove) {
        return {
          ...prevState,
          [key]: value
        }

      // Else remove key
      } else {
        delete prevState[key]
        return {
          ...prevState
        }        
      }
  
    })
  }


  return (
    <AppContext.Provider value={{
      sdk: sdk,
      entryQuery: entryQuery,
      updateEntryQuery: handleUpdateEntryQuery
    }}>
      {children}
    </AppContext.Provider>
  )
}