import { useState, useEffect } from 'react'
import { ValidationMessage, Spinner } from '@contentful/forma-36-react-components'

import TradeGroup from './TradeGroup'

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
   * Data from SDK/Contentful
   */
  const initialState = sdk.entry.fields.config && sdk.entry.fields.config.getValue() ? sdk.entry.fields.config.getValue() : null
  const [config, setConfig] = useState(initialState && initialState.custom)
  const [portfolioId, setPortfolioId] = useState(sdk.entry.fields.portfolioId && sdk.entry.fields.portfolioId.getValue() ? sdk.entry.fields.portfolioId.getValue() : null)
  const appParameters = sdk.parameters.instance ? sdk.parameters.instance : null


  /**
   * Set default vars/state for data retrieval
   */
  const defaultErrorMessage = 'There was an error retrieving the porfolio data.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(false)  

  /**
   * Primary configuration data
   */
  const [positionKeys, setPositionKeys] = useState([])
  const [subtradeKeys, setSubtradeKeys] = useState([])
  const [tradeGroups, setTradeGroups] = useState([])

  /**
   * Make updates on field changes
   */
  const handlePortfolioId = value => {
    setPortfolioId(sdk.entry.fields.portfolioId && sdk.entry.fields.portfolioId.getValue() ? sdk.entry.fields.portfolioId.getValue() : null)
  }

  /**
   * Add listener for SDK field changes
   */
  useEffect(() => {
    sdk.entry.fields.portfolioId.onValueChanged(handlePortfolioId);
  }, []);

  /**
   * Make call to endpoint to get configuration data
   */
  useEffect(() => {

    // Portfolio ID required
    if (!portfolioId) return

    // Show loading
    setIsProcessing(true)
    setShowError(false)

    // Get portfolio data
    fetchData(`${appParameters.portfolioApiUrl}?access_token=${appParameters.portfolioApiKey}&id=${portfolioId}`)
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
  }, [portfolioId])

  /**
   * Update complete config when data changes and update Contentful
   */
  useEffect(() => {

    // Final compiled config for Contentful fields
    const compiledConfig = { ...config }

    // Keys to chec
    const objectsToClean = [
      { open: ['columns', 'subtrades'] }, 
      { closed: ['columns', 'subtrades'] } 
    ]

    // Not pretty, but this loops through all of the data rows and make sure empty ones are stripped
    for (const [key, value] of Object.entries(compiledConfig)) {

      // If entire tradegroup is empty, remove completely
      if (Object.keys(compiledConfig[key]).length === 0) {
        delete compiledConfig[key]
        continue
      }

      // Start loopin'
      for (const obj of objectsToClean) {
        for (const [k, v] of Object.entries(obj)) {
          if (compiledConfig[key][k]) {
            for (const type of v) {
              if (compiledConfig[key][k][type] && compiledConfig[key][k][type].length > 0 ) {
                compiledConfig[key][k][type] = compiledConfig[key][k][type].filter(row => row.name)
              }
            }
          }
        }
      }
    }

    // Use SDK to update fields with a debounce to accomodate state updates
    const update = setTimeout(() => {
      const field = sdk.entry.fields.config
      if (Object.keys(compiledConfig).length > 0) {
        field.setValue({ custom: compiledConfig })
      } else {
        field.setValue()
      }
    }, 1000);
    return () => clearTimeout(update)

  }, [config])

  /**
   * Update main data state by merging with incoming update
   * @param  {id} str
   * @param  {obj} value
   */
  const updateConfig = (id, update) => {
    const updatedConfig = { ...config }
    updatedConfig[id] = update
    setConfig(updatedConfig)
  }

  /**
   * Build list of trade groups
   */
  const tradeGroupsList = []
  for (const group of tradeGroups) {
    const data = config && config[group.Id] ? config[group.Id] : {}
    tradeGroupsList.push(
      <TradeGroup
        key={group.Id}
        data={data}
        group={group}
        positionKeys={positionKeys}
        subtradeKeys={subtradeKeys}
        updateConfig={updateConfig}
      />
    )
  }

  return (
    <div className="app">
      {portfolioId && !showError ? tradeGroupsList : null}
      {isProcessing && <Spinner size="large" />}
      {showError && <ValidationMessage>{defaultErrorMessage}</ValidationMessage>}
      {!portfolioId && <ValidationMessage>Portfolio Id Required</ValidationMessage>}
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