import { useState, useEffect, useCallback } from 'react'

import { Select, Option, Paragraph, Spinner, ValidationMessage, Flex, FormLabel } from '@contentful/forma-36-react-components'

const Template = ({ sdk, initialValue, updateValue, appParameters }) => {

  /**
   * Setup state/constants
   */
  const targetId = 'templateId'
  const defaultErrorMessage = 'There was an error retrieving the templates.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(true)
  const [options, setOptions] = useState()
  const [templates, setTemplates] = useState()
  const [preselect, setPreselect] = useState(initialValue)
  const contentType = sdk.contentType.sys.id
  let entry  
  switch (contentType) {
    case 'post':
      entry = sdk.entry.fields.newsletter ? sdk.entry.fields.newsletter : null
      break
    default:
      entry = sdk.entry.fields.subscription ? sdk.entry.fields.subscription : null
      break
  }

  /**
   * Setup the SDK listener for field changes
   */
  useEffect(() => {
    const listenValueChange = entry.onValueChanged(handleValueChange);
  }, [templates])

  /**
   * On initial mount, get data from iterable and generate list Id options
   */
  useEffect(() => {
    fetchData(`https://api.iterable.com/api/templates?templateType=Base&messageMedium=Email&apiKey=${appParameters.iterableApiKey}`)
      .then(data => {

        // Build list of items and template data, filtering by those that include specified tag
        const arrayOptions = [],
              arrayTemplates = []
        for (let i = 0, len = data.templates.length; i < len; i++) {
          if (appParameters.templateTag && !data.templates[i].name.includes(`[${appParameters.templateTag}]`)) continue
          arrayOptions.push(
            <Option
              key={data.templates[i].templateId}
              value={data.templates[i].templateId}
            >
              {data.templates[i].name}
            </Option>
          )
          arrayTemplates.push(data.templates[i])
        }

        // Generate error on invalid tag - otherwise proceed
        if (arrayOptions.length === 0 ) {
          setErrorMessage('There are no templates with the provided tag.')
          setShowError(true)
        } else {
          setOptions(arrayOptions)
          setTemplates(arrayTemplates)
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
   * When field entry changes, update the template dropdown to find the first template name that includes the appropriate tag
   * Tags are itemNumbers or listCodes depending on entry type
   * @param  {obj} value
   * @return {null}
   */
  const handleValueChange = useCallback(value => {

    // If option already assigned, ignore
    if (preselect) return

    // If an entry is selected and templates are loaded kickoff the process
    if (value && value.length !== 0 && templates) {

      // Get entry data (subscription or newsletter)
      const data = sdk.space.getEntry(value[0].sys.id)
      data.then(res => {

        // Extract the itemNumber or listCode
        let code
        switch (contentType) {
          case 'post':
            code = res.fields.listCode ? res.fields.listCode['en-US'] : null
            break
          default:
            code = res.fields.itemNumber ? res.fields.itemNumber['en-US'] : null
            break
        }

        // Loop through templates and find first with an appropriate tag
        for (let i = 0, len = templates.length; i < len; i++) {
          if (!templates[i].name.includes(`[${code}]`)) continue;
          updateValue(targetId, parseInt(templates[i].templateId, 10))
          setPreselect(parseInt(templates[i].templateId, 10))
          break
        }

      }).catch(error => {
        console.log('error', error);
      })

    // Else, reset back to default
    } else {
      updateValue(targetId, 0)
      setPreselect(0)
    }
  }, [templates])

  /**
   * On select, update parent data and remove invalid options
   */
  const handleSelect = value => {
    updateValue(targetId, parseInt(value, 10))
  }

  /**
   * Build display var
   */
  const select = (
    <Flex>
      <Select value={preselect} name={targetId} onChange={event => handleSelect(event.target.value)} required>
        <Option value="0">Select Template</Option>
        {options}
      </Select>
    </Flex>
  )

  return (
    <div className="template">
      <FormLabel htmlFor={targetId} required>Template</FormLabel>
      {isProcessing ? <Paragraph><Spinner /></Paragraph> : null}
      {!isProcessing && showError ? <ValidationMessage>{errorMessage}</ValidationMessage> : null}
      {!isProcessing && !showError ? select : null}
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

export default Template