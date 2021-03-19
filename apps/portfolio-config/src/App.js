import { useState, useEffect } from 'react'
import { ValidationMessage, Spinner } from '@contentful/forma-36-react-components'

import TradeGroup from './TradeGroup'

// const portfolioId = '13572'
// const portfolioId = '13168'

// const initialState = {}
// const initialState = {"custom":{"0":{"open":{"defaultSort":"Text3","defaultDirection":"desc","columns":[{"name":"Name","label":"Company"},{"name":"Text1","label":"Action"},{"name":"Weight","label":"Qty"},{"name":"Text2","label":"Description"},{"name":"Symbol","label":"Symbol"},{"name":"OpenDate","label":"Entry Date","type":"date","format":"F j, Y"},{"name":"OpenPrice","label":"Entry Price","type":"currency"},{"name":"CurrentClosePrice","label":"Current Price","type":"currency"},{"name":"Text3","label":"Income","type":"currency"}]},"closed":{"defaultSort":"Text3","defaultDirection":"desc","columns":[{"name":"Name","label":"Company"},{"name":"Text1","label":"Original Action"},{"name":"Weight","label":"Qty"},{"name":"Text2","label":"Notes"},{"name":"Symbol","label":"Symbol"},{"name":"OpenDate","label":"Entry Date","type":"date","format":"F j, Y"},{"name":"OpenPrice","label":"Entry Price","type":"currency"},{"name":"CloseDate","label":"Close Date","type":"date","format":"F j, Y"},{"name":"Text3","label":"Net Income","type":"currency"}]}},"10736":{"open":{"defaultSort":"CurrentClosePrice","defaultDirection":"desc","includeSubtrades":true,"columns":[{"name":"Name","label":"Company"},{"name":"Text1","label":"Action"},{"name":"Weight","label":"Qty"},{"name":"Text2","label":"Notes"},{"name":"Symbol","label":"Symbol"},{"name":"OpenDate","label":"Entry Date","type":"date","format":"F j, Y"},{"name":"OpenPrice","label":"Entry Price","type":"currency"},{"name":"CurrentClosePrice","label":"Current Price","type":"currency"}],"subtrades":[{"name":"Text1","label":"Action"},{"name":"Weight","label":"Qty"},{"name":"Text2","label":"Notes"},{"name":"Symbol","label":"Symbol"},{"name":"OpenDate","label":"Entry Date","type":"date","format":"F j, Y"},{"name":"OpenPrice","label":"Entry Price","type":"currency"},{"name":"Text3","label":"Income"}]},"closed":{"includeSubtrades":true,"columns":[{"name":"Name","label":"Company"},{"name":"Text1","label":"Original Action"},{"name":"Weight","label":"Qty"},{"name":"Text2","label":"Notes"},{"name":"Symbol","label":"Symbol"},{"name":"OpenDate","label":"Entry Date","type":"date","format":"F j, Y"},{"name":"OpenPrice","label":"Entry Price","type":"currency"},{"name":"CloseDate","label":"Close Date","type":"date","format":"F j, Y"}],"subtrades":[{"name":"Text1","label":"Original Action"},{"name":"Weight","label":"Qty"},{"name":"Text2","label":"Notes"},{"name":"Symbol","label":"Symbol"},{"name":"OpenDate","label":"Entry Date","type":"date","format":"F j, Y"},{"name":"OpenPrice","label":"Entry Price","type":"currency"},{"name":"CloseDate","label":"Close Date","type":"date","format":"F j, Y"},{"name":"CurrentClosePrice","label":"Exit Price","type":"currency"},{"name":"Text3","label":"Income"}]}}}}

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

  // const initialState = initialState && initialState.custom

  /**
   * Set default vars/state for data retrieval
   */
  const defaultErrorMessage = 'There was an error retrieving the porfolio data.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(false)
  const [portfolioId, setPortfolioId] = useState('13572')
  // const [portfolioId, setPortfolioId] = useState()
  const [config, setConfig] = useState()

  /**
   * Primary configuration data
   */
  const [positionKeys, setPositionKeys] = useState([])
  const [subtradeKeys, setSubtradeKeys] = useState([])
  const [tradeGroups, setTradeGroups] = useState([])


  useEffect(() => {
    console.log('Use SDK to get portfolioID here, with SKD watcher for changes');
  }, [])

  useEffect(() => {
    console.log('Use SDK to get initial state from field');
  }, [])

  /**
   * Make call to endpoint to get configuration data
   */
  useEffect(() => {

    // Portfolio ID required
    if (!portfolioId) return

    // Show loading
    setIsProcessing(true)

    // Get portfolio data
    fetchData(``)
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

    // Use SDK to update adjacent fields
    const forContentful = { custom: compiledConfig }


    // const field = sdk.entry.fields.
    // field.setValue(data)
    // format and cleanup
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

    // TODO
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
      {tradeGroupsList}
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