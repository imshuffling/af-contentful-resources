// import axios from 'axios'
// import { isEmpty } from 'library/utility/global'

/**
 * Default configuration for formatting consumable portfolio data
 */
const defaultConfig = {
  "default": {
    "open": {
      "defaultSort": "Gain",
      "defaultDirection": "desc",
      "defaultType": "",
      "includeSubtrades": false,
      "includeLinks": true,
      "columns": [
      {
        "name": "Symbol",
        "label": "Symbol"
      },
      {
        "name": "Name",
        "label": "Name"
      },
      {
        "name": "Text2",
        "label": "Comments"
      },
      {
        "name": "OpenDate",
        "label": "Entry Date",
        "type": "date",
        "format": "F j, Y"
      },
      {
        "name": "OpenPrice",
        "label": "Entry Price",
        "type": "currency"
      },
      {
        "name": "CurrentClosePrice",
        "label": "Current Price",
        "type": "currency"
      },
      {
        "name": "Dividends",
        "label": "Dividends",
        "type": "currency"
      },
      {
        "name": "Gain",
        "label": "Percent Gain",
        "type": "percent"
      }
      ],
      subtrades: [
      {
        "name": "Symbol",
        "label": "Symbol"
      },
      {
        "name": "Text2",
        "label": "Comments"
      },
      {
        "name": "OpenDate",
        "label": "Entry Date",
        "type": "date",
        "format": "F j, Y"
      },
      {
        "name": "OpenPrice",
        "label": "Entry Price",
        "type": "currency"
      },
      {
        "name": "CurrentClosePrice",
        "label": "Current Price",
        "type": "currency"
      }
      ]
    },
    closed: {
      "defaultSort": "CloseDate",
      "defaultDirection": "desc",
      "defaultType": "",
      "includeSubtrades": false,
      "includeLinks": true,
      "columns": [
      {
        "name": "Symbol",
        "label": "Symbol"
      },
      {
        "name": "Name",
        "label": "Name"
      },
      {
        "name": "Text2",
        "label": "Comments"
      },
      {
        "name": "OpenDate",
        "label": "Entry Date",
        "type": "date",
        "format": "F j, Y"
      },
      {
        "name": "OpenPrice",
        "label": "Entry Price",
        "type": "currency"
      },
      {
        "name": "CloseDate",
        "label": "Exit Date",
        "type": "date",
        "format": "F j, Y"
      },
      {
        "name": "CurrentClosePrice",
        "label": "Exit Price",
        "type": "currency"
      },
      {
        "name": "Dividends",
        "label": "Dividends",
        "type": "currency"
      },
      {
        "name": "Gain",
        "label": "Percent Gain",
        "type": "percent"
      }
      ],
      subtrades: [
      {
        "name": "Symbol",
        "label": "Symbol"
      },
      {
        "name": "Text2",
        "label": "Comments"
      },
      {
        "name": "OpenDate",
        "label": "Entry Date",
        "type": "date",
        "format": "F j, Y"
      },
      {
        "name": "OpenPrice",
        "label": "Entry Price",
        "type": "currency"
      },
      {
        "name": "CloseDate",
        "label": "Exit Date",
        "type": "date",
        "format": "F j, Y"
      },
      {
        "name": "CurrentClosePrice",
        "label": "Exit Price",
        "type": "currency"
      }
      ]
    }
  }
}

/**
 * Parse and reformat the API response from Tradesmith based on supplied config
 * @param  {arr} rawData
 * @param  {obj} customConfig
 * @return {arr}
 */
export const formatPortfolioData = (rawData, customConfig) => {

  // Require data from portfolio API
  if (rawData === undefined) return

  // Combine supplied custom configuration with default config
  customConfig = customConfig === undefined ? defaultConfig : {...defaultConfig, ...customConfig}
 
  /**
   * Global Variables
   */
  
  // Array of all trade groups - by default, positions with no trade group assigned will always be index 0
  const tradeGroupArray = [{ Id: 0, Positions: { Open: [], Closed: [] } }]
 
  // Contains only viable trade group data, with trade group ID as key for later use
  let tradeGroupObject = {}

  // Active positions
  let publishedPositions = []

  // Returned array of complete position/trade group options
  const completeData = []

  /**
   * First step is to build the trade groups from the top level positions,
   * secondary positions will only include a $ref id
   * Also set up our global variables used throughout the rest of the process
   */

  for (let i = 0, len = rawData.length; i < len; i++) {

    // Build if trade group data provided
    if (rawData[i].TradeGroup.$id !== undefined && rawData[i].TradeGroup.Name) {
            
      // Merge new trade group object into object
      const newTradeGroup = { ...rawData[i].TradeGroup, Positions: { Open: [], Closed: [] } }

      // Push to global data array
      tradeGroupArray.push(newTradeGroup)

      // Merge with global object
      tradeGroupObject = {
        ...tradeGroupObject,
        [rawData[i].TradeGroup.$id]: rawData[i].TradeGroup      
      }
    }
  }

  /**
   * Get the specified config setting (custom or default) based on the supplied position or position ID
   * If verifying the setting of a subtrade, must provide parent position object
   * @param  {str} config
   * @param  {str} status     (open or closed)
   * @param  {obj|int} position
   * @param  {[obj]} tradeGroupObject
   * @param  {obj} parentPosition
   * @return {bool}
   */
  const getConfigSetting = (configSetting, status, position, tradeGroupObject, parentPosition) => {

    // Required objects
    if (configSetting === undefined || position === undefined) return

    // Replace position with parent position if subtrade
    position = parentPosition !== undefined ? parentPosition : position

    // Set vars
    let tradeGroupRefId,
        tradeGroupId,
        configSettingValue = customConfig.default[status][configSetting] // Default

    // If position ID (int) is provided, use, otherwise get from TradeGroup by ID or reference
    // TradeGroupID of 0 indicates unaffiliated positions
    if (Number.isInteger(position)) {
      tradeGroupId = position
    } else {
      tradeGroupRefId = position.TradeGroup.$id ? position.TradeGroup.$id : position.TradeGroup.$ref
      tradeGroupId = tradeGroupObject[tradeGroupRefId] ? tradeGroupObject[tradeGroupRefId].Id : 0      
    }

    // If configuration meets all requirements for custom setting, use that instead
    if (customConfig.custom
      && customConfig.custom[tradeGroupId] !== undefined
      && customConfig.custom[tradeGroupId][status] !== undefined
      && !isEmpty(customConfig.custom[tradeGroupId][status])
      && customConfig.custom[tradeGroupId][status][configSetting] !== undefined
    ) {
      configSettingValue = customConfig.custom[tradeGroupId][status][configSetting]
    }

    return configSettingValue

  }

  /**
   * Get the specified config column mapping for top or subtrade level based on trade group ID
   * @param  {int} tradeGroupId
   * @param  {str} status       (open or closed)
   * @param  {str} columnType   (columns or subtrades)
   * @return {arr}
   */
  const getColumnsConfig = (tradeGroupId, status, columnType) => {

    // Set default var
    let columnConfig = customConfig.default[status][columnType]

    // If configuration meets all requirements for custom setting, use that instead
    if (customConfig.custom
      && customConfig.custom[tradeGroupId] !== undefined
      && customConfig.custom[tradeGroupId][status] !== undefined
      && !isEmpty(customConfig.custom[tradeGroupId][status])
      && customConfig.custom[tradeGroupId][status][columnType] !== undefined
    ) {
      columnConfig = customConfig.custom[tradeGroupId][status][columnType]
    }

    return columnConfig

  }

  /**
   * Build each object for use as table row based on the desired configuration
   * @param  {obj} position
   * @param  {obj} config
   * @param  {obj} parentPosition
   * @return {obj}
   */
  const buildRowObject = (position, config, parentPosition) => {
    
    // Set data vars    
    const key = config.name && config.name,
          label = config.label && config.label,
          value = position[key] && position[key],
          type = config.type && config.type || 'string',
          format = config.format && config.format || null,
          status = position.IsOpened ? 'open' : 'closed',
          linkKey = `${key}Link`,
          linkConfig = getConfigSetting('includeLinks', status, position, tradeGroupObject, parentPosition),
          link = linkConfig && position[linkKey] ? position[linkKey] : null

    // If value exisits, build the data row
    if (value !== undefined) {
      return { [key]:
            {
              value: value,
              label: label,
              type: type,
              format: format,
              link: link
            }
          }        
    }
    return
  }

  /**
   * Get all subtrade rows for a given position
   * @param  {arr} subtrades
   * @param  {obj} config
   * @param  {object} parentPosition
   * @return {arr}
   */
  const getSubtradeRowData = (subtrades, config, parentPosition) => {
      
      // Set vars
      const subtradeData = []
      let subtradesObject = {}

      // Loop through each subtrade
      for (let i = 0, len = subtrades.length; i < len; i++) {
      
        // Loop through each subtrade config column
        for (let x = 0, len = config.length; x < len; x++) {

          // Build new row object and merge
          const newSubtrade = buildRowObject(subtrades[i], config[x], parentPosition)
          subtradesObject = { ...subtradesObject, ...newSubtrade }

        }

        // Append
        subtradeData.push({ columns: subtradesObject })

      }

      return subtradeData

  }

  /**
   * Get all rows of data for positions by their group and position (open/closed) and mapped to config
   * @param  {str} positions
   * @param  {obj} config
   * @param  {str} status         (open or closed)
   * @param  {obj} subtradesConfig
   * @return {obj}
   */
  const getRowData = (positions, config, status, subtradesConfig) => {

    // Must have positions and configuration mapping supplied
    if (positions.length < 1 || config === undefined) return []

    // Set vars
    const rowData = []
    let newRow

    // Loop through each position row
    for (let i = 0, len = positions.length; i < len; i++) {

      // Reset columns object
      let column = {}

      // Loop through each config column
      for (let x = 0, len = config.length; x < len; x++) {

        // Reset subtrades array for each position
        let subtrades = []

        // Check if subtrades are requested and include
        const includeSubtrades = getConfigSetting('includeSubtrades', status, positions[i], tradeGroupObject)
        if (includeSubtrades) subtrades = getSubtradeRowData(positions[i].Subtrades, subtradesConfig, positions[i])

        // Build new row object
        const newColumn = buildRowObject(positions[i], config[x])

        // Combine data for consumption
        if (newColumn) {
          column = { ...column, ...newColumn }
          newRow = {
            id: positions[i].$id,
            includeSubtrades: includeSubtrades,
            subtradesVisible: false,
            columns: column,
            subtrades: subtrades
          }

        }
      }

    // Append
    rowData.push(newRow)

    }

    return rowData

  }  

  /**
   * Second major step is to remove any unpublished positions
   * and create a paired down array of only viable options
   */
  
  for (let i = 0, len = rawData.length; i < len; i++) {
    if (rawData[i].PositionSetting.Published) {

      // Merge position settings for top level trades into main object for easier configuration
      const positionSettings = rawData[i].PositionSetting
      const newItem = { ...rawData[i], ...positionSettings }
      const status = rawData[i].IsOpened ? 'open' : 'closed'

      // Check if subtrades are requested and merge them to the top level of each subtrade
      const includeSubtrades = getConfigSetting('includeSubtrades', status, rawData[i], tradeGroupObject)
      
      if ( includeSubtrades ) {        
        const subtrades = newItem.Subtrades
        for (let x = 0, len = subtrades.length; x < len; x++) {
          const SubtradeSetting = subtrades[x].SubtradeSetting
          newItem.Subtrades[x] = { ...subtrades[x], ...SubtradeSetting }
        }  
      }

      // Append to global var
      publishedPositions.push(newItem)

    } 
  }

  /**
   * Next we sort all of the published positions into their trade groups
   * and determine if either open or closed
   */

  for (let i = 0, len = publishedPositions.length; i < len; i++) {

    // Get the tradegroup reference ID as key
    const tradeGroupRefId = publishedPositions[i].TradeGroup.$id ? publishedPositions[i].TradeGroup.$id : publishedPositions[i].TradeGroup.$ref

    // Using reference id, find the proper trade group in array by index
    const targetTradeGroup = (tradeGroup) => tradeGroup.$id === tradeGroupRefId
    let targetIndex = tradeGroupArray.findIndex(targetTradeGroup)

    // if index is zero i meants its unassigned - keep it first [0]
    if ( targetIndex === -1 ) targetIndex = 0

    // Check open/closed status and push to appropriate array
    if (publishedPositions[i].IsOpened) {
      tradeGroupArray[targetIndex].Positions.Open.push(publishedPositions[i])
    } else {
      tradeGroupArray[targetIndex].Positions.Closed.push(publishedPositions[i])
    }

  }

  /**
   * Cleanup and sort trade group array by the order determined in Tradesmith
   */
  
  if (tradeGroupArray.length > 1) {
    tradeGroupArray.sort((a, b) => {

      // Set default
      let itemA = a.TradeGroupOrder,
          itemB = b.TradeGroupOrder

      // Compare and adjust position
      if (itemA < itemB) return -1
      if (itemA > itemB) return 1
      return 0

    })
  }

  /**
   * Last step of data configuration, go through each trade group and bulid complete data set
   * for open/closed positions, subtrades, table header configs, etc
   */
  
  for (const row of tradeGroupArray) {

    // Open
    const openColumns = getColumnsConfig(row.Id, 'open', 'columns')
    const openColumnsSubtrades = getColumnsConfig(row.Id, 'open', 'subtrades')
    const openPositions = row.Positions.Open

    // Closed
    const closedColumns = getColumnsConfig(row.Id, 'closed', 'columns')
    const closedColumnsSubtrades = getColumnsConfig(row.Id, 'closed', 'subtrades')
    const closedPositions = row.Positions.Closed

    // Complete trade group object with config and row data
    const result = {
      config: {
        portfolioHeader: row.Name && row.Name || '',
        tradeGroupId: row.Id && row.Id || 0,
        open: {
          defaultSort: getConfigSetting('defaultSort', 'open', row.Id, tradeGroupObject),
          defaultDirection: getConfigSetting('defaultDirection', 'open', row.Id, tradeGroupObject),
          defaultType: getConfigSetting('defaultType', 'open', row.Id, tradeGroupObject),
          includeSubtrades: getConfigSetting('includeSubtrades', 'open', row.Id, tradeGroupObject),
          columns: openColumns,
          subtradeHeaders: openColumnsSubtrades
        },
        closed: {
          defaultSort: getConfigSetting('defaultSort', 'closed', row.Id, tradeGroupObject),
          defaultDirection: getConfigSetting('defaultDirection', 'closed', row.Id, tradeGroupObject),
          defaultType: getConfigSetting('defaultType', 'closed', row.Id, tradeGroupObject),
          includeSubtrades: getConfigSetting('includeSubtrades', 'closed', row.Id, tradeGroupObject),
          columns: closedColumns,
          subtradeHeaders: closedColumnsSubtrades
        },
      },
      rows: {
        open: getRowData(openPositions, openColumns, 'open', openColumnsSubtrades),
        closed: getRowData(closedPositions, closedColumns, 'closed', closedColumnsSubtrades)
      }
    }

    // Apend to global variable
    completeData.push(result)

  }

  // Filter data
  let filteredData

  // Remove any trade groups that have empty rows for open and closed
  filteredData = completeData.filter(group => {
    return !isEmpty(group.rows.open) || !isEmpty(group.rows.closed)
  })

  if (customConfig.custom !== undefined && customConfig.custom.exclude !== undefined && !isEmpty(customConfig.custom.exclude)) {
    filteredData = filteredData.filter(group => {
      return !customConfig.custom.exclude.includes(group.config.tradeGroupId.toString())
    })
  }

  return filteredData

}

/**
 * Get portfolio data from Tradesmith via middlware
 * @param  {in} portfolioId
 * @return {obj}
 */
// export async function getPortfolioData(portfolioId) {
// 
//   // All params required
//   if (!portfolioId) return
// 
//   // Get all user meta
//   const response = await axios.get('/api/portfolio', {
//     params: {
//       id: portfolioId
//     }
//   })
// 
//   // Build error if no data returned
//   if (!response.data) {
//     response.data = {
//       ...response.data,
//       error: true
//     }
//   }
// 
//   return response
// 
// }

/**
 * Determine if array or object is empty
 * @param  {obj|arr} subject
 * @return {bool}
 */
const isEmpty = subject => {

  switch(true) {
    case subject === undefined:
      console.error('[', subject, '] Is undefined: isEmpty()')
      return false
    case Array.isArray(subject):
      if (subject.length === 0) return true
      break
    case (typeof subject === 'object' && subject !== null):
      if (Object.keys(subject).length === 0) return true
      break
    default:
      return false
  }

  return false
}