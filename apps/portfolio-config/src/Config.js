import { useState, useEffect } from 'react'
import { Switch, Flex, Checkbox, FormLabel, TextLink } from '@contentful/forma-36-react-components'

import ConfigTable from './ConfigTable'

const Config = ({ group, data, status, positionKeys, subtradeKeys, updateTradeGroup }) => {

  /**
   * Display constants
   */
  const checkboxClass = 'f36-margin-left--s'
  const labelClass = 'f36-margin-left--xs'

  /**
   * View toggle state
   */
  const [showCustomColumns, setShowCustomColumns] = useState(data.showCustomColumns && data.showCustomColumns === true ? true : false)
  const [showCustomSubtradeColumns, setShowCustomSubtradeColumns] = useState(data.showCustomSubtradeColumns && data.showCustomSubtradeColumns === true ? true : false)

  /**
   * Options state
   */
  const [includeCustomColumns, setIncludeCustomColumns] = useState(data.includeCustomColumns && data.includeCustomColumns === true ? true : false)
  const [includeSubtrades, setIncludeSubtrades] = useState(data.includeSubtrades && data.includeSubtrades === true ? true : false)
  const [includeCustomSubtradeColumns, setIncludeCustomSubtradeColumns] = useState(data.includeCustomColumns && data.includeCustomColumns === true ? true : false)
  const [includeLinks, setIncludeLinks] = useState(data.includeLinks && data.includeLinks === true ? true : false)
  const [statusConfigData, setStatusConfigData] = useState(data)

  /**
   * Reset data options on clear
   */
  useEffect(() => {
    if (Object.keys(data).length === 0) {
      setShowCustomColumns(false)
      setShowCustomSubtradeColumns(false)
      setIncludeCustomColumns(false)
      setIncludeSubtrades(false)
      setIncludeCustomSubtradeColumns(false)
      setIncludeLinks(false)
    }
  }, [data])

  /**
   * Pass through to imitate form submit and grab all rows of fields
   */
  const updateStatusConfig = update => {

    // Set data/local state for merge
    const columns = 'columns' in update ? update : null 
    const subtrades = 'subtrades' in update ? update : null
    const includeSubtradesUpdate = 'includeSubtrades' in update ? update : null
    const includeLinksUpdate = 'includeLinks' in update ? update : null
    const includeCustomColumnsUpdate = 'includeCustomColumns' in update ? update : null
    const includeCustomSubtradeColumnsUpdate = 'includeCustomSubtradeColumns' in update ? update : null
    const showCustomColumnsUpdate = 'showCustomColumns' in update ? update : null
    const showCustomSubtradeColumnsUpdate = 'showCustomSubtradeColumns' in update ? update : null

    // Merge data
    const mergedConfig = {
      ...statusConfigData,
      ...columns,
      ...subtrades,
      ...includeSubtradesUpdate,
      ...includeLinksUpdate,
      ...includeCustomColumnsUpdate,
      ...includeCustomSubtradeColumnsUpdate,
      ...showCustomColumnsUpdate,
      ...showCustomSubtradeColumnsUpdate
    }

    // Update local and parent state
    setStatusConfigData(mergedConfig)
    updateTradeGroup(status, mergedConfig)

  }

  /**
   * Add a new row to the config table
   * @param  {str} type
   */
  const handleAddRow = type => {
    let newRowConfig = {
      ...statusConfigData
    }
    
    // If no previous rows, build object with empty row
    if (!newRowConfig[type]) {
      const newObj = { [type]: [{}] }
      newRowConfig = { 
        ...newRowConfig,
        ...newObj
      }

    // Else just append an empty row
    } else {
      newRowConfig[type].push({})
    }

    updateStatusConfig(newRowConfig)
  }

  /**
   * Primary position column configuration table
   */
  const positionConfigTable = (
    <Flex marginTop="spacingXs">
      <ConfigTable
        key={`columns-${status}-${group.Id}`}
        data={data && data.columns ? data.columns : []}
        type="columns"
        keys={positionKeys}
        defaultSort={data.defaultSort && data.defaultSort}
        defaultDirection={data.defaultDirection && data.defaultDirection}
        updateStatusConfig={updateStatusConfig}
      />
    </Flex>
  )

  /**
   * Subtrade column configuration table
   */
  const subtradeConfigTable = (
    <Flex marginTop="spacingXs">
      <ConfigTable
        key={`subtrades-${status}-${group.Id}`}
        data={data && data.subtrades ? data.subtrades : []}
        type="subtrades"
        keys={subtradeKeys}
        defaultSort={data.defaultSort && data.defaultSort}
        defaultDirection={data.defaultDirection && data.defaultDirection}
        updateStatusConfig={updateStatusConfig}
      />
    </Flex>
  )

  return (
    <div className="trade-group__config f36-margin-bottom--l">
      <Flex justifyContent="space-between" marginBottom="spacingS">
        <div>
          <Checkbox
            id="includeLinks"
            checked={includeLinks}
            value={true}
            onChange={() => {
              setIncludeLinks(!includeLinks)
              updateStatusConfig({ includeLinks: !includeLinks })
            }}
          />
          <FormLabel className={labelClass}>Include Links</FormLabel>
        </div>
        <div>
          <Checkbox
            id="includeCustomColumns"
            checked={includeCustomColumns}
            value={true}
            onChange={() => {
              setIncludeCustomColumns(!includeCustomColumns)
              updateStatusConfig({ includeCustomColumns: !includeCustomColumns })
            }}
          />
          <FormLabel className={labelClass}>Custom Columns</FormLabel>
        </div>
        <div>
          <Checkbox
            id="includeSubtrades"            
            checked={includeSubtrades}
            value={true}
            onChange={() => {
              setIncludeSubtrades(!includeSubtrades)
              updateStatusConfig({ includeSubtrades: !includeSubtrades })
            }}          
          />
          <FormLabel className={labelClass}>Include Subtrades</FormLabel>
        </div>
        <div>
          <Checkbox
            id="includeCustomSubtradeColumns"
            checked={includeCustomSubtradeColumns && includeSubtrades ? true : false}
            disabled={!includeSubtrades ? true : false}
            value={true}
            onChange={() => {
              setIncludeCustomSubtradeColumns(!includeCustomSubtradeColumns)
              updateStatusConfig({ includeCustomSubtradeColumns: !includeCustomSubtradeColumns })
            }}
          />
          <FormLabel className={labelClass}>Custom Subtrade Columns</FormLabel>
        </div>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" marginTop="spacingM">
        <Switch
          labelText="Configure Columns"
          isChecked={includeCustomColumns && showCustomColumns ? true : false}
          onToggle={() => {
            setShowCustomColumns(!showCustomColumns)
            updateStatusConfig({ showCustomColumns: !showCustomColumns })
          }}
          isDisabled={!includeCustomColumns ? true : false}
        />
        {includeCustomColumns && showCustomColumns ?
          <TextLink
            icon="Plus"
            onClick={() => handleAddRow('columns')}

          >
            Add Row
          </TextLink>
          : null }
      </Flex>

      {includeCustomColumns && showCustomColumns ? positionConfigTable : null }

      <Flex justifyContent="space-between" alignItems="center" marginTop="spacingM">
        <Switch
         labelText="Configure Subtrade Columns"
         isChecked={showCustomSubtradeColumns}
         isChecked={includeCustomSubtradeColumns && showCustomSubtradeColumns ? true : false}
         onToggle={() => {
            setShowCustomSubtradeColumns(!showCustomSubtradeColumns)
            updateStatusConfig({ showCustomSubtradeColumns: !showCustomSubtradeColumns })
          }}
         isDisabled={!includeCustomSubtradeColumns ? true : false}
       />
       {includeCustomSubtradeColumns && showCustomSubtradeColumns ?
        <TextLink
          icon="Plus"
          onClick={() => handleAddRow('subtrades')}
        >
          Add Row
        </TextLink>
        : null }
     </Flex>

     {includeCustomSubtradeColumns && showCustomSubtradeColumns ? subtradeConfigTable : null }

    </div>
  )
}

export default Config