import { useState, useEffect } from 'react'
import { Switch, Flex, CheckboxField, TextLink } from '@contentful/forma-36-react-components'

import ConfigTable from './ConfigTable'

const Config = ({ status, positionKeys, subtradeKeys, updateTradeGroup }) => {

  const fauxData = [
    { 'key': '123' },
    { 'key': 'abc' }
  ]

  /**
   * Display constants
   */
  const checkboxClass = 'f36-margin-left--s'

  /**
   * View toggle state
   */
  const [showCustomColumns, setShowCustomColumns] = useState(false)
  const [showCustomSubtradeColumns, setShowCustomSubtradeColumns] = useState(false)

  /**
   * Options state
   */
  const [includeCustomColumns, setIncludeCustomColumns] = useState(false)
  const [includeSubtrades, setIncludeSubtrades] = useState(false)
  const [includeCustomSubtradeColumns, setIncludeCustomSubtradeColumns] = useState(false)
  const [includeLinks, setIncludeLinks] = useState(true)
  const [statusConfigData, setStatusConfigData] = useState()


  const updateStatusConfig = update => {

    // Merge update and current state
    const mergedConfig = {
      ...statusConfigData,
      ...update
    }

    // Update local state
    setStatusConfigData(mergedConfig)

    // console.log('updateStatusConfig', mergedConfig);

    // Append merged to group Id for top level config
    updateTradeGroup({
      [status]: mergedConfig
    })
    
  }

  // TODO
  // Simple toggle updates
  // useEffect(() => {
  //   updateTradeGroup({
  //     [status]: {
  //       "enable": true,
  //       "includeSubtrades": includeSubtrades,
  //       "includeLinks": includeLinks,
  //     }
  //   })
  // }, [includeLinks, includeSubtrades])




  /**
   * Primary position column configuration table
   */
  const positionConfigTable = (
    <Flex marginTop="spacingXs">
      <ConfigTable
        type="columns"
        keys={positionKeys}
        data={fauxData}
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
        type="subtrades"
        keys={subtradeKeys}
        data={fauxData}
        updateStatusConfig={updateStatusConfig}
      />
    </Flex>
  )

  return (
    <div className="trade-group f36-padding-bottom--m">
      <Flex justifyContent="space-between" marginBottom="spacingL">
        <CheckboxField
          labelText="Include Links"
          id="includeLinks"
          checked={includeLinks}
          value={true}
          onChange={() => {
            setIncludeLinks(!includeLinks)
            updateStatusConfig({ includeLinks: !includeLinks })
          }}
        />
        <CheckboxField
          labelText="Custom Columns"
          id="includeCustomColumns"
          className={checkboxClass}
          checked={includeCustomColumns}
          value={true}
          onChange={() => setIncludeCustomColumns(!includeCustomColumns)}          
        />
        <CheckboxField
          labelText="Include Subtrades"
          id="includeSubtrades"
          className={checkboxClass}
          checked={includeSubtrades}
          value={true}
          onChange={() => setIncludeSubtrades(!includeSubtrades)}
          onChange={() => {
            setIncludeSubtrades(!includeSubtrades)
            updateStatusConfig({ includeSubtrades: !includeSubtrades })
          }}          
        />
        <CheckboxField
          labelText="Custom Subtrade Columns"
          id="includeCustomSubtradeColumns"
          className={checkboxClass}
          checked={includeCustomSubtradeColumns && includeSubtrades ? true : false}
          disabled={!includeSubtrades ? true : false}
          value={true}
          onChange={() => setIncludeCustomSubtradeColumns(!includeCustomSubtradeColumns)}          
        />
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" marginTop="spacingM">
        <Switch
          labelText="Configure Columns"
          isChecked={includeCustomColumns && showCustomColumns ? true : false}
          onToggle={setShowCustomColumns}
          isDisabled={!includeCustomColumns ? true : false}
        />
        {includeCustomColumns && showCustomColumns ? <TextLink icon="Plus">Add Row</TextLink> : null }
      </Flex>

      {includeCustomColumns && showCustomColumns ? positionConfigTable : null }

      <Flex justifyContent="space-between" alignItems="center" marginTop="spacingM">
        <Switch
         labelText="Configure Subtrade Columns"
         isChecked={showCustomSubtradeColumns}
         isChecked={includeCustomSubtradeColumns && showCustomSubtradeColumns ? true : false}
         onToggle={setShowCustomSubtradeColumns}
         isDisabled={!includeCustomSubtradeColumns ? true : false}
       />
       {includeCustomSubtradeColumns && showCustomSubtradeColumns ? <TextLink icon="Plus">Add Row</TextLink> : null }
     </Flex>

     {includeCustomSubtradeColumns && showCustomSubtradeColumns ? subtradeConfigTable : null }

    </div>
  )
}

export default Config