import { useState, useEffect } from 'react'
import { Subheading, Tag, Switch, TextLink, Checkbox, Flex, ModalConfirm } from '@contentful/forma-36-react-components'

import Config from './Config'

const TradeGroup = ({ group, data, positionKeys, subtradeKeys, updateConfig }) => {

  /**
   * Set state/constants
   */
  const margin = 'spacingM'
  const [isVisible, setIsVisible] = useState(true)
  const [showOptions, setShowOptions] = useState(false)
  const [showOpen, setShowOpen] = useState(data && data.open ? true : false)
  const [isEnabled, setIsEnabled] = useState(Object.keys(data).length > 0 ? true : false)
  const [showClosed, setShowClosed] = useState(data && data.closed ? true : false)
  const [groupConfigData, setGroupConfigData] = useState({})
  const [showModal, setShowModal] = useState(false);

  /**
   * Check SDK fields for data
   */
  useEffect(() => {
    setIsEnabled(Object.keys(data).length > 0 ? true : false)
  }, [data])

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
   * Clear entire config for this trade group
   */
  const handleClearSettings = () => {
    updateConfig(group.Id, {})
  }

  /**
   * Clear settings
   */
  const clearSettings = (
    <>
      <TextLink
        linkType="negative"
        onClick={() => setShowModal(true)}
        style={{ fontSize: '.75rem', textAlign: 'right' }}
      >
        [Clear All Settings]
      </TextLink>
      <ModalConfirm
        isShown={showModal}
        intent="negative"
        title="Clear All Settings"
        onClose={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false)
          handleClearSettings()
        }}
      >
        Are you sure you want to clear all settings for this group?
      </ModalConfirm>
    </>
  )

  /**
   * Open config toggle
   */
  const openConfig = (
    <Flex
      justifyContent="space-between"
      marginBottom="spacingS"
    >
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
    <Flex
      justifyContent="space-between"
      paddingTop="spacingM"
      marginBottom="spacingM"
      style={{ borderTop: '1px dotted #d3dce0' }}
    >
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
        <Flex>
          <Tag
            tagType={isEnabled ? 'positive' : 'secondary'}
          >
            {isEnabled ? 'Enabled' : 'Unset'}
          </Tag>
          <Switch
            labelText="Show Custom Config"
            isChecked={showOptions}
            onToggle={showOptions}
            className="f36-margin-left--s trade-group__toggle"
          />
        </Flex>
      </Subheading>

      {showOptions && clearSettings}

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