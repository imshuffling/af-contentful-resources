import { useState, useEffect, useCallback } from 'react'

import { Paragraph, Spinner, ValidationMessage, Autocomplete, Pill, FormLabel } from '@contentful/forma-36-react-components'

const Lists = ({ sdk, initialValue, updateValue, appParameters }) => {
  
  /**
   * Setup state/constants
   */
  const targetId = 'listIds'
  const defaultErrorMessage = 'There was an error retrieving the lists.'
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)
  const [isProcessing, setIsProcessing] = useState(true)
  const [items, setItems] = useState([])
  const [lists, setLists] = useState()
  const [filteredItems, setFilteredItems] = useState(items)
  const [selectedItems, setSelectedItems] = useState(initialValue)
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
  }, [lists])

  /**
   * On initial mount, get data from iterable and generate list Id options
   */
  useEffect(() => {
    fetchData(`https://api.iterable.com/api/lists?apiKey=${appParameters.iterableApiKey}`)
      .then(data => {

        // Build list of options and list data, filtering by those that include specified tag
        const arrayOptions = [],
              arrayLists = []
        const array = []
        for (let i = 0, len = data.lists.length; i < len; i++) {
          if (appParameters.listTag && !data.lists[i].name.includes(`[${appParameters.listTag}]`)) continue
          arrayOptions.push(
            {
              "value": data.lists[i].id,
              "label": data.lists[i].name
            }
          )
          arrayLists.push(data.lists[i])
        }

        // Generate error on invalid tag - otherwise proceed
        if (arrayOptions.length === 0 ) {
          setErrorMessage('There are no lists with the provided tag.')
          setShowError(true)
        } else {
          setItems(arrayOptions)
          setLists(arrayLists)
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
   * Update filterable items, removing those already selected
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
   * When field entry changes, update the selected lits to find the first list name that includes the appropriate tag
   * Tags are itemNumbers or listCodes depending on entry type
   * @param  {obj} value
   * @return {null}
   */
  const handleValueChange = useCallback(value => {

    // If an entry is selected and lists are loaded kickoff the process
    if (value && value.length !== 0 && lists && lists.length !== 0) {

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

        // Loop through templates and find first with an appropriate tag and skipping already added
        for (let i = 0, len = lists.length; i < len; i++) {
          if (!lists[i].name.includes(`[${code}]`)) continue
          if (selectedItems.includes(lists[i].id)) continue
          const array = [...selectedItems, lists[i].id]
          updateValue(targetId, array)
          setSelectedItems(array)
          break
        }

      }).catch(error => {
        console.log('error', error);
      })

    }

  }, [lists])

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
      <FormLabel htmlFor={targetId} required>List Ids</FormLabel>
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