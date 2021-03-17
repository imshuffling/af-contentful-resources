import { useState, useEffect } from 'react'
import { Subheading, Switch, Flex } from '@contentful/forma-36-react-components'

import Config from './Config'

const TradeGroup = ({ group, positionKeys, subtradeKeys, updateConfig }) => {

  /**
   * Initial data state
   * @type {obj}
   */
  const initialState = {
    "open": {},
    "closed": {}
  }

  /**
   * Set state/constants
   */
  const margin = 'spacingM'
  const [showOptions, setShowOptions] = useState(false)
  const [showOpen, setShowOpen] = useState(false)
  const [showClosed, setShowClosed] = useState(false)
  const [groupConfigData, setGroupConfigData] = useState(initialState)

  /**
   * Update the combined trade group local state and main config
   * @param  {obj} update
   */
  const updateTradeGroup = update => {

    // Merge update and current state
    const mergedConfig = {
      ...groupConfigData,
      ...update
    }

    // Update local state
    setGroupConfigData(mergedConfig)

    // Append merged to group Id for top level config
    updateConfig({
      [group.Id]: mergedConfig
    })
    
  }

  /**
   * Update local state and config if making custom changes to those positions
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
   */
  const handleToggleOptions = type => {
    
    // Toggle display
    if (type === 'open') {
      setShowOpen(!showOpen)
      setGroupConfigData(prevState => {

        // Toggle exclusiion from config generation
        prevState[type].exclude = showOpen

        // Update parent config
        updateConfig({
          [group.Id]: prevState
        })
        return prevState
      })

    // For closed  
    } else {
      setShowClosed(!showClosed)
      setGroupConfigData(prevState => {

        // Toggle exclusiion from config generation
        prevState[type].exclude = showClosed

        // Update parent config
        updateConfig({
          [group.Id]: prevState
        })
        return prevState
      })
    }
  }

  /**
   * Open config toggle
   */
  const openConfig = (
    <Flex marginBottom="spacingS">
      <Switch
        labelText="Open Positions"
        isChecked={showOpen}
        onToggle={() => handleToggleOptions('open')}
      />
    </Flex>
  )

  /**
   * Closed config toggle
   */
  const closedConfig = (
    <Flex paddingTop="spacingM" marginBottom="spacingM" style={{ borderTop: '1px dotted #d3dce0' }}>
      <Switch
        labelText="Closed Positions"
        isChecked={showClosed}
        onToggle={() => handleToggleOptions('closed')}
      />
    </Flex>
  )

  return (
    <div className="trade-group">
      <Subheading
        className="trade-group-heading"
        onClick={() => setShowOptions(!showOptions)}
        style={{ display: 'flex' }}
      >
        {group.Name}
        <Switch
          labelText="Use Custom Config"
          isChecked={showOptions}
          onToggle={showOptions}
        />
      </Subheading>

      {showOptions && openConfig}
      {showOptions && showOpen ?
        <Config
          status="open"
          positionKeys={positionKeys}
          subtradeKeys={subtradeKeys}
          updateTradeGroup={updateTradeGroup}
        />
        : null
      }

      {showOptions && closedConfig}
      {showOptions && showClosed ?
        <Config
          status="closed"
          positionKeys={positionKeys}
          subtradeKeys={subtradeKeys}
          updateTradeGroup={updateTradeGroup}
        />
        : null
      }
    </div>
  )
}

export default TradeGroup