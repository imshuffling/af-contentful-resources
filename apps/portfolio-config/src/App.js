import { useState, useEffect } from 'react'
import {
  Switch,
  TextField,
  Flex,
  FormLabel,
  ValidationMessage,
  Button,
  Paragraph,
  Select,
  Option,
  Accordion,
  AccordionItem,
  CopyButton,
  Spinner,
} from '@contentful/forma-36-react-components'

// import Lists from './Lists'
import TradeGroup from './TradeGroup'
import { formatPortfolioData } from './library/portfolio'

const portfolioId = '13572'
// const portfolioId = '13168'

// Array of keys to remove from column configuraiton
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

const type = [
  'default',
  'percent',
  'currency',
  'date'
]

const dateFormat = [
  {
    label: 'January 1, 1970',
    value: 'F j, Y'
  },
  {
    label: 'Jan 1, 1970',
    value: ''
  },
  {
    label: '01/01/1970',
    value: ''
  }
]

const App = ({ sdk }) => {

  /**
   * Set default vars/state for data retrieval
   */
  const defaultErrorMessage = 'There was an error retrieving the porfolio data.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(true)

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

          // Generate default formatted portfolio to extracting trade groups
          setTradeGroups(formatPortfolioData(data))
          
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
  // const  = sdk.entry.fields. && sdk.entry.fields..getValue() ? sdk.entry.fields..getValue() : initialState
  // const [setup, setSetup] = useState(.sendEmail)
  // const [data, setData] = useState()

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
//   const updateValue = (key, value) => {
//     setData( prevState => {
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
// 
//       return {
//         ...prevState,
//         [key]: value
//        }
//     })
//   }

  /**
   * Build list of trade groups
   */
  const tradeGroupsList = []
  for (const group of tradeGroups) {
      tradeGroupsList.push(
        <TradeGroup
          key={group.config.tradeGroupId}
          group={group}
          positionKeys={positionKeys}
          subtradeKeys={subtradeKeys}
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