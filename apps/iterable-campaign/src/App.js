import { useState, useEffect } from 'react'
import { Switch, TextField, Flex, ValidationMessage, Button } from '@contentful/forma-36-react-components'

import Lists from './Lists'
import Template from './Template'

const App = ({ sdk }) => {

  /**
   * Initial data state
   * @type {obj}
   */
  const initialState = {
    "name": "",
    "listIds": [],
    "templateId": 0,
    "sendEmail": false,
    "subject-line": "",
    "headline": "",
    "preheader": ""
  }

  /**
   * Configuration object for generating simple text fields
   * @type {obj}
   */
  const simpleFieldsConfig = [
    {
      "key": "name",
      "label": "Campaign Name",
      "required": true
    },
    {
      "key": "subject-line",
      "label": "Subject Line",
      "helper": "Defaults to entry title (if not provided)"
    },
    {
      "key": "headline",
      "label": "Headline",
      "helper": "Defaults to entry title (if not provided)"
    },
    {
      "key": "preheader",
      "label": "Preheader"
    }
  ]

  /**
   * Set state/constants
   */
  const margin = 'spacingM'
  const iterableObject = sdk.entry.fields.iterableObject && sdk.entry.fields.iterableObject.getValue() ? sdk.entry.fields.iterableObject.getValue() : initialState
  const [setup, setSetup] = useState(iterableObject.sendEmail)
  const [data, setData] = useState(iterableObject)

  /**
   * Update field when data changes
   */
  useEffect(() => {
    const field = sdk.entry.fields.iterableObject
    field.setValue(data)
  }, [data])

  /**
   * When toggling set
   * @param  {[type]} ( [description]
   * @return {[type]}   [description]
   */
  useEffect(() => {
    if (setup && data.templateId > 0 && data.listIds.length > 0 && data.name) {
      updateValue('sendEmail', true)
    } else {
      updateValue('sendEmail', false)
    }
  }, [setup])


  /**
   * Update main data object, pass as callback to components
   * Check if all parameters are checked to allow campaign creation
   * @param  {str} key
   * @param  {str|arr} value
   * @return {null}
   */
  const updateValue = (key, value) => {
    setData( prevState => {
      let temp = {
        ...prevState,
        [key]: value
      }

      // Check for requires and verify if OK to create campaign
      if (setup && temp.templateId > 0 && temp.listIds.length > 0 && temp.name) {
        prevState = { ...prevState, "sendEmail": true }
      } else {
        prevState = { ...prevState, "sendEmail": false }
      }

      return {
        ...prevState,
        [key]: value
       }
    })
  }

  /**
   * Generate a list of simple text input fields based on config array
   * @return {arr}
   */
  const simpleFields = simpleFieldsConfig.map(field => {
    return (
      <Flex key={field.key} marginTop={margin}>
        <TextField
          value={data && data[field.key] ? data[field.key] : ''}
          maxLength={255}
          name={field.key}
          id={field.key}
          labelText={field.label}
          helpText={field.helper}
          required={field.required ? true : false}
          onChange={event => updateValue(`${field.key}`, event.target.value)}
        />
      </Flex>
    )
  })

  /**
   * Build simple error list item
   * @param  {[str]} string
   * */
  const buildRequiredItem = string => {
    return <>&bull; {string}<br/></>
  }

  /**
   * Show list of required items to send campaign
   */
  const requirements = (
    <Flex marginTop={margin}>
      <ValidationMessage>
        The following items are required to create a campaign before publishing:<br />
        {data.listIds && data.listIds.length === 0 && buildRequiredItem('List Ids')}
        {!data.templateId && buildRequiredItem('Template')}
        {!data.name && buildRequiredItem('Campaign Name')}
      </ValidationMessage>
    </Flex>
  )

  /**
   * Build list selection
   */
  const listSelect = (
    <Flex marginTop={margin}>
      <Lists
        sdk={sdk}
        initialValue={data.listIds}
        updateValue={updateValue}
        appParameters={sdk.parameters.instance}
      />
    </Flex>
  )

  /**
   * Build template selection
   */
  const templateSelect = (
    <Flex marginTop={margin}>
      <Template
        sdk={sdk}
        initialValue={data.templateId}
        updateValue={updateValue}
        appParameters={sdk.parameters.instance}
      />
    </Flex>
  )

  /**
   * Generated preview link
   */
  const preview = (
    <Flex marginTop={margin}>
      <Button
        href={`${sdk.parameters.instance.emailPreviewUrl}/preview?template=${data.templateId}&entry=${sdk.ids.entry}`}
        target="_blank"
        style={{ width: '100%'}}
        icon="Cycle"
        disabled={setup && !data.sendEmail}
      >
        Generate email preview
      </Button>
    </Flex>
  )

  return (
    <div className="app">
      <Flex>
        <Switch
          id="sendEmail"
          labelText="Setup Iterable Campaign?"
          isChecked={setup}
          onToggle={() => setSetup(!setup)}
        />
      </Flex>
      {setup && listSelect}
      {setup && templateSelect}
      {setup && simpleFields}
      {setup && !data.sendEmail ? requirements : null}
      {setup && preview}
    </div>
  );
}

export default App