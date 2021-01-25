import { useState, useEffect } from 'react'

import { Select, Option, Paragraph, Spinner, ValidationMessage, Button, Flex, FormLabel } from '@contentful/forma-36-react-components'

const Lists = ({ initialValue, updateValue }) => {

  // Setup state/constants
  const targetId = 'listIds'
  const [showError, setShowError] = useState(false)
  const [isProcessing, setIsProcessing] = useState(true)
  const [options, setOptions] = useState()
  const [rows, setRows] = useState(initialValue)

  /**
   * On initial mount, get data from iterable and generate list Id options
   */
  useEffect(() => {
    fetchData('https://api.iterable.com/api/lists?apiKey=96dca32cf0d244ecb4806d4dc37f396a')
      .then(data => {
        console.log('data', data);
        const items = data.lists.map((item) => {
          return (
            <Option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </Option>
          )
        })
        setOptions(items)
      })
      .catch(error => {
        setShowError(true)
      })
      .then(() => {
        setIsProcessing(false)
      })

    }, [])

  // Add row to list options
  const handleAdd = row => {
    const array = [...rows],
          rand = Math.floor(Math.random() * -1000)
    array.push(rand)
    setRows(array)
  }

  // Remove a row
  const handleRemove = row => {
    const array = [...rows]
    const index = array.indexOf(row);
    if (index > -1) array.splice(index, 1);
    setRows(array)
  }

  // On select, update parent data and remove invalid options
  const handleSelect = (row, value) => {
    if (!value) return
    const array = [...rows]
    const index = array.indexOf(row);
    if (index > -1) array.splice(index, 1, parseInt(value, 10));
    setRows(array)
    updateValue(targetId, array.filter(id => id > 0))
  }

  // Set display var
  const items = []

  // Build display var
  for (let i = 0, len = rows.length; i < len; i++) {
    items.push (
      <>
        <Flex justifyContent="space-between" key={rows[i]} marginTop={i === 0 ? '' : 'spacingS'}>
          <Flex>
            <Select value={rows[i]} name={targetId} onChange={event => handleSelect(rows[i], event.target.value)} required>
              <Option value="">Select A List</Option>
              {options}
            </Select>
          </Flex>
          <Flex marginLeft="spacing2Xs">
            <Button
              icon="Plus"
              onClick={() => handleAdd(rows[i])}
            />
            &nbsp;
            <Button
              icon="Close"
              onClick={() => handleRemove(rows[i])}
              buttonType={i === 0 ? 'muted' : 'negative'}
              disabled={i === 0}
            />
          </Flex>
        </Flex>
      </>
    )
  }

  return (
    <div className="lists">
      <FormLabel htmlFor={targetId}>List Ids</FormLabel>
      {isProcessing ? <Paragraph><Spinner /></Paragraph> : null}
      {!isProcessing && showError ? <ValidationMessage>There was an error retrieving the lists.</ValidationMessage> : null}
      {!isProcessing && !showError ? items : null}
    </div>
  )
}

// Simple fetch async function
const fetchData = async url => {
  const response = await fetch(url)
  return response.json()
}

export default Lists
