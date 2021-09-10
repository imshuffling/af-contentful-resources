import React, { useState } from 'react'
import { init, locations } from '@contentful/app-sdk'

export const AppContext = React.createContext()

export const AppContextProvider = ({ sdk, children }) => {

  /**
   * Default query params
   */
  const initialEntryQuery = {
    "content_type": null,
    "limit": 1000,
  }

  // Set state for app context
  const [entryQuery, setEntryQuery] = useState(initialEntryQuery)
  console.log('entryQuery', entryQuery);

  /**
   * Update the entry query params, add key/value pair or remove by key
   * @param  {str}  key
   * @param  {str}  value
   * @param  {bool} remove
   * @return {null}
   */
  const handleUpdateEntryQuery = (key = '', value = '', remove = false) => {

    // Required params
    if (!key) return
    if (!value && !remove && key !== 'content_type') return

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