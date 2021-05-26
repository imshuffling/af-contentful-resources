import { useState, useEffect } from 'react'
import { Switch, TextField, Flex, ValidationMessage, Button, Note, Spinner, Paragraph } from '@contentful/forma-36-react-components'

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
  const hasCampaign = sdk.entry.fields.iterableCampaignId && sdk.entry.fields.iterableCampaignId.getValue() ? true : false

  const [setup, setSetup] = useState(iterableObject.sendEmail)
  const [showSetup, setShowSetup] = useState(!hasCampaign)
  const [data, setData] = useState(iterableObject)
  const [processing, setProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('An error has occurred.')
  const [hasError, setHasError] = useState(false)

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
   * Add listener for SDK field changes
   * We treat the campaign ID as a confirmation that an email has been setup
   */
  useEffect(() => {
    sdk.entry.fields.iterableCampaignId.onValueChanged(handleCampaignIdChange);
  }, []);

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
   * If iterableCampaignId value is added then hide setup
   * @param  {str} value
   * @return {null}
   */
  const handleCampaignIdChange = value => {
    if (value) {
      setSetup(false)
      setShowSetup(false)
    }
  }

  /**
   * Send request to create new campaign
   */
  const handleCreateCampaign = () => {

    // Build final params will data from entry
    const params = {
      ...data,
      "access_token": sdk.parameters.instance.wiggumApiKey,
      "contentType": sdk.ids.contentType,
      "article-id": sdk.ids.entry,
      "title": sdk.entry.fields.title.getValue(),
      "content": sdk.entry.fields.content.getValue(),
      "dynamicContent": sdk.entry.fields.dynamicContent.getValue(),
    }

    // Update UI
    setHasError(false)
    setProcessing(true)

    // Send request
    postData('https://wiggum.agorafinancial.com/api/tfrsites/post/sendemail', params)
      .then((response) => {

        // Expecting an number greater than 0 as a campaign ID to confirm success
        // Sometimes a success will return an campaign ID of 0, but we'll proceed anyway
        if (Number.isInteger(response)) {

          // Update entry with campaign ID
          const field = sdk.entry.fields.iterableCampaignId
          field.setValue(response.toString())

        } else {
          setHasError(true)
          setErrorMessage('An error has occurred. Check your data and try again.')
        }
      })
      .catch((error) => {
        setHasError(true)
        setErrorMessage('An error has occurred.')
      })
      .then(() => {
        setProcessing(false)
      })
  }

  /**
   * Remove the iterableCampaignId and reset iterableObject
   */
  const handleNewCampaign = () => {
    const field = sdk.entry.fields.iterableCampaignId
    field.removeValue()
    setData(initialState)
    setShowSetup(true)
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
        The following items are required to create a campaign:<br />
        {data.listIds && data.listIds.length === 0 && buildRequiredItem('List Ids')}
        {!data.templateId && buildRequiredItem('Template')}
        {!data.name && buildRequiredItem('Campaign Name')}
      </ValidationMessage>
    </Flex>
  )

  /**
   * Build list selection
   */
  const campaignNotice = (
    <Flex>
      <Note noteType="positive">
        An email campaign has been created for this entry.<br /><br />
        <Button
          onClick={handleNewCampaign}
          size="small"
        >
          Setup New Campaign
        </Button>
      </Note>
    </Flex>
  )

  /**
   * Build setup toggle switch
   */
  const setupToggle = (
    <Flex>
      <Switch
        id="sendEmail"
        labelText="Setup Iterable campaign?"
        isChecked={setup}
        onToggle={() => setSetup(!setup)}
      />
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
        icon="ExternalLink"
        disabled={setup && !data.sendEmail}
      >
        View email preview
      </Button>
    </Flex>
  )

  /**
   * Generate button to create new campaign in Iterable
   */
  const create = (
    <div className='f36-margin-top--m'>
      <Button
        onClick={handleCreateCampaign}
        style={{ width: '100%'}}
        icon="Cycle"
        buttonType="positive"
        disabled={!data.sendEmail || processing}
      >
        Create campaign
      </Button>
      <div className='f36-margin-top--xs'>
        {processing && <Paragraph><Spinner /></Paragraph>}      
        {hasError && <ValidationMessage>{errorMessage}</ValidationMessage>}
      </div>
    </div>
  )

  return (
    <div className="app">
      {!showSetup && campaignNotice}
      {showSetup && setupToggle}
      {setup && listSelect}
      {setup && templateSelect}
      {setup && simpleFields}
      {setup && !data.sendEmail ? requirements : null}
      {setup && preview}
      {setup && create}
    </div>
  )
}

/**
 * Simple post async function
 * @param  {str} url
 * @param  {obj} data
 */
const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  });
  return response.json()
}

export default App