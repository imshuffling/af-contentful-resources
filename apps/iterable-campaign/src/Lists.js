import { useState, useEffect, useCallback } from 'react'

import { Paragraph, Spinner, ValidationMessage, Autocomplete, Pill, FormLabel } from '@contentful/forma-36-react-components'

const Lists = ({ initialValue, updateValue, appParameters }) => {
  
  /**
   * Setup state/constants
   */
  const targetId = 'listIds'
  const defaultErrorMessage = 'There was an error retrieving the lists.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(true)
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItems, setSelectedItems] = useState(initialValue);

  /**
   * On initial mount, get data from iterable and generate list Id options
   */
  useEffect(() => {
    fetchData(`https://api.iterable.com/api/lists?apiKey=${appParameters.iterableApiKey}`)
      .then(data => {

        // Build list of items, filtering by those that include specified tag
        const array = []
        for (let i = 0, len = data.lists.length; i < len; i++) {
          if (appParameters.listTag && !data.lists[i].name.includes(`${appParameters.listTag}`)) continue
          array.push(
            {
              "value": data.lists[i].id,
              "label": data.lists[i].name
            }
          )
        }

        // Generate error on invalid tag - otherwise proceed
        if (array.length === 0 ) {
          setErrorMessage('There are no lists with the provided tag.')
          setShowError(true)
        } else {
          setItems(array)
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
   * Update filterable items, removing thos already selected
   */
  useEffect(() => {
    const filtered = items.filter(item => {
      return !selectedItems.includes(item.value)
    })
    setFilteredItems(filtered)
  }, [items, selectedItems])

  /**
   * Refilter selected list on input change
   */
  const handleQueryChange = useCallback(query => {
      setFilteredItems(
        query ? items.filter((item) => item.label.includes(query)) : items,
      )
    },
    [items, setFilteredItems],
  )

  /**
   * Add list to selected data
   */
  const handleAddList = item => {
    const array = [...selectedItems, item.value]
    updateValue(targetId, array)
    setSelectedItems(array)
  } 

  /**
   * Remove selections from data array and update
   */
  const handleRemoveList = value => {
    const array = [...selectedItems]
    const index = array.indexOf(value);
    array.splice(index, 1);
    updateValue(targetId, array)
    setSelectedItems(array)
  }

  /**
   * Build search field for lists selection
   */
  const listSearch = (
    <Autocomplete
      items={filteredItems}
      onQueryChange={handleQueryChange}
      onChange={handleAddList}
      maxHeight={200}
      placeholder="Search Lists"
    >
      {options =>
        options.map(option => (<span key={option.value}>{option.label}</span>))
      }
    </Autocomplete>
  )

  /**
   * Build display for selected lists
   */  
  const selectedLists = []
  for (let i = 0, len = selectedItems.length; i < len; i++) {
    const found = items.find(element => element.value === selectedItems[i]);
    if (found) {
      selectedLists.push(
        <Pill
          className="f36-margin-top--s f36-margin-right--s"
          key={found.value}
          label={found.label}
          onClose={() => handleRemoveList(found.value)}
        />
      )
    }
  }

  return (
    <div className="lists">
      <FormLabel htmlFor={targetId}>List Ids</FormLabel>
      {isProcessing ? <Paragraph><Spinner /></Paragraph> : null}
      {!isProcessing && showError ? <ValidationMessage>{errorMessage}</ValidationMessage> : null}
      {!isProcessing && !showError ? listSearch : null}
      {selectedLists}
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

export default Lists