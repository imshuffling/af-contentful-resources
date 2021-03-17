import { useState, useEffect } from 'react'
import { ValidationMessage, Spinner } from '@contentful/forma-36-react-components'
import { formatPortfolioData } from './library/portfolio'

import TradeGroup from './TradeGroup'

const portfolioId = '13572'
// const portfolioId = '13168'

/**
 * Array of keys to remove from column configurations
 */
const keysToRemove = [
  'Guid',
  'id',
  '$id',
  'TradeGroup',
  'PositionSetting',
  'PositionContent',
  'Subtrades',
  'SpinOffs',
  'Splits',
  'SubtradeSetting',
  'SymbolId',
  'Color',
  'ActionStatusXML'
]

const App = ({ sdk }) => {

  /**
   * Set default vars/state for data retrieval
   */
  const defaultErrorMessage = 'There was an error retrieving the porfolio data.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(true)
  const [config, setConfig] = useState()

  /**
   * Primary configuration data
   */
  const [positionKeys, setPositionKeys] = useState([])
  const [subtradeKeys, setSubtradeKeys] = useState([])
  const [tradeGroups, setTradeGroups] = useState([])

  /**
   * Make call to endpoint to get configuration data
   */
  useEffect(() => {
    fetchData(`https://wiggum.agorafinancial.com/api/tfrsites/portfolio/?access_token=2B78LaqgE4pc7rar&id=${portfolioId}`)
      .then(data => {

        // Handle missing/incorrect data
        if (!data || data.length === 0 ) {
          setErrorMessage('There are no portfolios with the provided id.')
          setShowError(true)
        } else {

          // Generate list of trade groups for configuraiton
          const tradeGroupArray = [{ Id: 0, Name: 'Ungrouped' }]
          for (let i = 0, len = data.length; i < len; i++) {

            // Build if trade group data provided
            if (data[i].TradeGroup.$id !== undefined && data[i].TradeGroup.Name) {
                    
              // Merge new trade group object into object
              const newTradeGroup = { ...data[i].TradeGroup }

              // Push to new array for state
              tradeGroupArray.push(newTradeGroup)
            }
          }
          setTradeGroups(tradeGroupArray)
          
          // Grab first position for primary/subtrade to build config options
          const positionSample = data[0]
          const subtradeSample = positionSample.Subtrades && positionSample.Subtrades.length > 0 ? positionSample.Subtrades[0] : []

          // Merge all data into top array for easy configuration
          const positionSettings = positionSample.PositionSetting
          const newPositionSample = { ...positionSample, ...positionSettings }
          const subtradeSettings = subtradeSample.SubtradeSetting
          const newSubtradeSample = { ...subtradeSample, ...subtradeSettings }

          // Remove unused keys from options config
          for (const key of keysToRemove) {
            delete newPositionSample[key]
            delete newSubtradeSample[key]
          }

          // Generate arrays of viable config options and set
          const positionOptions = []
          const subtradeOptions = []
          for (const [key, value] of Object.entries(newPositionSample)) positionOptions.push(key)
          for (const [key, value] of Object.entries(newSubtradeSample)) subtradeOptions.push(key)
          setPositionKeys(positionOptions)
          setSubtradeKeys(subtradeOptions)        

        }

      })
      .catch(error => {
        setErrorMessage(defaultErrorMessage)
        setShowError(true)
      })
      .then(() => {
        setIsProcessing(false)
      })
  }, [])

  /**
   * Set state/constants
   */
  // const config = sdk.entry.fields.config && sdk.entry.fields.config.getValue() ? sdk.entry.fields.config.getValue() : null
  

  /**
   * Update field when data changes
   */
  // useEffect(() => {
  //   const field = sdk.entry.fields.
  //   field.setValue(data)
  // }, [data])

  /**
   * Update main data object, pass as callback to components
   * Check if all parameters are checked to allow campaign creation
   * @param  {str} key
   * @param  {str|arr} value
   * @return {null}
   */
  const updateConfig = (data) => {
    console.log('OPEN', data[0].open);
    // console.log('CLOSED', data[0].closed);
    // setConfig( prevState => {
//       let temp = {
//         ...prevState,
//         [key]: value
//       }
// 
//       // Check for requires and verify if OK to create campaign
//       if (setup && temp.templateId > 0 && temp.listIds.length > 0 && temp.name) {
//         prevState = { ...prevState, "sendEmail": true }
//       } else {
//         prevState = { ...prevState, "sendEmail": false }
//       }

    //   return {
    //     ...prevState,
    //     [key]: value
    //    }
    // })
  }

  /**
   * Build list of trade groups
   */
  const tradeGroupsList = []
  for (const group of tradeGroups) {
      tradeGroupsList.push(
        <TradeGroup
          key={group.Id}
          group={group}
          positionKeys={positionKeys}
          subtradeKeys={subtradeKeys}
          updateConfig={updateConfig}
        />
      )
  }

  return (
    <div className="app">
      {tradeGroupsList}
      {isProcessing && <Spinner size="large" />}
      {showError && <ValidationMessage>{defaultErrorMessage}</ValidationMessage>}
    </div>
  )
}

/**
 * Simple fetch async function
 * @param  {str} url
 */
const fetchData = async url => {
  const response = await fetch(url)
  return response.json()
}

export default App