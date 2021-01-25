import { useState, useEffect } from 'react'

import { Select, Option, Paragraph, Spinner, ValidationMessage, Flex, FormLabel } from '@contentful/forma-36-react-components'

const Template = ({ initialValue, updateValue, appParameters }) => {

  /**
   * Setup state/constants
   */
  const targetId = 'templateId'
  const defaultErrorMessage = 'There was an error retrieving the templates.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(true)
  const [options, setOptions] = useState()

  /**
   * On initial mount, get data from iterable and generate list Id options
   */
  useEffect(() => {
    fetchData(`https://api.iterable.com/api/templates?templateType=Base&messageMedium=Email&apiKey=${appParameters.iterableApiKey}`)
      .then(data => {

        // Build list of items, filtering by those that include specified tag
        const array = []
        for (let i = 0, len = data.templates.length; i < len; i++) {
          if (appParameters.templateTag && !data.templates[i].name.includes(`${appParameters.templateTag}`)) continue
          array.push(
            <Option
              key={data.templates[i].templateId}
              value={data.templates[i].templateId}
            >
              {data.templates[i].name}
            </Option>
          )
        }

        // Generate error on invalid tag - otherwise proceed
        if (array.length === 0 ) {
          setErrorMessage('There are no templates with the provided tag.')
          setShowError(true)
        } else {
          setOptions(array)
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
   * On select, update parent data and remove invalid options
   */
  const handleSelect = value => {
    if (!value) return
    updateValue(targetId, parseInt(value, 10))    
  }

  /**
   * Build display var
   */
  const select = (
    <Flex>
      <Select value={initialValue} name={targetId} onChange={event => handleSelect(event.target.value)} required>
        <Option value="">Select Template</Option>
        {options}
      </Select>
    </Flex>
  )

  return (
    <div className="template">
      <FormLabel htmlFor={targetId}>Template</FormLabel>
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