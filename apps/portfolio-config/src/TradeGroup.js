import { useState, useEffect } from 'react'
import { Subheading, Switch, Checkbox, Flex } from '@contentful/forma-36-react-components'

import Config from './Config'

const TradeGroup = ({ group, data, positionKeys, subtradeKeys, updateConfig }) => {

  /**
   * Set state/constants
   */
  const margin = 'spacingM'
  const [isVisible, setIsVisible] = useState(true)
  const [showOptions, setShowOptions] = useState(false)
  const [showOpen, setShowOpen] = useState(false)
  const [showClosed, setShowClosed] = useState(false)
  const [groupConfigData, setGroupConfigData] = useState({})

  /**
   * Update the combined trade group local state and main config
   * @param  {int} status
   * @param  {obj} update
   */
  const updateTradeGroup = (status, update) => {

    // Create a clone of the current state and update the data by status (open/closed)
    const updatedConfig = { ...groupConfigData }
    updatedConfig[status] = update

    // Update local and parent state
    setGroupConfigData(updatedConfig)
    updateConfig(group.Id, updatedConfig)
  }

  /**
   * Open config toggle
   */
  const openConfig = (
    <Flex marginBottom="spacingS">
      <Switch
        labelText="Open Positions"
        isChecked={showOpen}
        onToggle={setShowOpen}
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
        onToggle={setShowClosed}
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
          group={group}
          data={data && data.open ? data.open : {}}
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
          group={group}
          data={data && data.closed ? data.closed : {}}
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