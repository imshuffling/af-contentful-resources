import { useState } from 'react'
import { Switch, TextField, Flex } from '@contentful/forma-36-react-components'

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
    "templateId": "",
    "sendEmail": false,
    "subject-line": "",
    "headline": "",
    "preheader": "",
    "foobar": "Search"
  }

  /**
   * Configuration object for generating simple text fields
   * @type {obj}
   */
  const simpleFieldsConfig = [
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
  const [data, setData] = useState(initialState)

  /**
   * Update main data object, pass as callback to components
   * @param  {str} key
   * @param  {str|arr} value
   * @return {null}
   */
  const updateValue = (key, value) => {
    setData( prevState => {
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
          value={data[field.key]}
          maxLength={255}
          name={field.key}
          id={field.key}
          labelText={field.label}
          helpText={field.helper}
          onChange={event => updateValue(`${field.key}`, event.target.value)}
        />
      </Flex>
    )
  })

  /**
   * Build list selection
   */
  const listSelect = (
    <Flex marginTop={margin}>
      <Lists
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
        initialValue={data.templateId}
        updateValue={updateValue}
        appParameters={sdk.parameters.instance}
      />
    </Flex>
  )

  return (
    <div className="app">
      <Flex>
        <Switch
          id="sendEmail"
          labelText="Setup Iterable Campaign?"
          isChecked={data.sendEmail}
          onToggle={event => updateValue('sendEmail', !data.sendEmail)}
        />
      </Flex>
      {data.sendEmail && listSelect}
      {data.sendEmail && templateSelect}
      {data.sendEmail && simpleFields}
    </div>
  );
}

export default App