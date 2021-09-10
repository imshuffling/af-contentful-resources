import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context'

import {
  Autocomplete,
  Pill,
  Select,
  Option,
  TextInput,
  FormLabel,
  Grid
} from '@contentful/forma-36-react-components'

const operations = {
  "Any Selected Tag": "[in]",
  "All Selected Tags": "[all]"
}

const FilterByTags = () => {

  // Grab app context
  const { sdk, updateEntryQuery, entryQuery } = useContext(AppContext)

  // Set state for this module
  const [tags, setTags] = useState([])
  const [filteredTags, setFilteredTags] = useState(tags)
  const [selectedTags, setSelectedTags] = useState([])
  const [operator, setOperator] = useState('')

  /**
   * Grab tags from content type when created
   * @return {null}
   */
  useEffect(() => {
    getEntryTags()
  }, [])

  /**
   * Update query with value using timeout
   * Remove param from main query when dropped
   * @return {null}
   */
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (selectedTags.length > 0 && operator) {
        handleAddQuery()
      }
    }, 500)
    return () => {
      handleRemoveQuery()
      clearTimeout(timeout)
    }
  }, [selectedTags, operator])

  /**
   * Query SDK to generate list of filterable tags
   * @return {null}
   */
  const getEntryTags = () => {
    if (!entryQuery.content_type) return
    const response = sdk.space.readTags(entryQuery.content_type)
    response.then(res => {
      if (res.items && Array.isArray(res.items)) {
        res.items.sort((a, b) => {
            const textA = a.name.toUpperCase()
            const textB = b.name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
        setTags(res.items)
        setFilteredTags(res.items)
      }
    })
  }

  /**
   * Update selected tags
   * @param  {obj} tag
   * @return {null}
   */
  const handleTagSelect = tag => {
    setSelectedTags(prevState => {
      return [
        ...prevState,
        tag
      ]
    })
  }

  /**
   * Update viable tags based on text search query
   * @param  {str} query
   * @return {null}
   */
  const handleTagQueryChange = query => {
    query = query.toLowerCase()
    setFilteredTags(
      query ? tags.filter(item => item.name.toLowerCase().includes(query)) : tags,
    )
  }

  /**
   * Remove selected tags from selection
   * @return {null}
   */
  const handleRemoveTag = tag => {
    setSelectedTags(prevState => {      
      const items = prevState.filter(item => item.sys.id !== tag.sys.id)
      return items
    })
  }

  /**
   * Update operator and reset value when selecting new operator
   * @param  {obj} event
   * @return {null}
   */
  const handleOperatorSelect = event => {
    setOperator(event.target.value)
  }

  /**
   * Push valid filter query up to app context
   * @return {null}
   */
  const handleAddQuery = () => {
    const tagList = selectedTags.map(tag => tag.sys.id).join(',')
    if (tagList && operator) updateEntryQuery(`metadata.tags.sys.id${operator}`, tagList)
  }

  /**
   * Remove filter query from app context
   * @return {null}
   */
  const handleRemoveQuery = () => {
    if (operator) updateEntryQuery(`metadata.tags.sys.id${operator}`, '', true)
  }

  /**
   * Build the autocomplete field for tags
   * @return {str}
   */
  const generateFieldSelect = () => {

    // Build options list, excluding already selected options
    let items = [...filteredTags]
    for (const tag of selectedTags) {
      items = items.filter(item => item.sys.id !== tag.sys.id)
    }

    return (
      <div>
        <FormLabel>Tags</FormLabel>
        <Autocomplete
          items={items}
          onQueryChange={handleTagQueryChange}
          maxHeight={200}
          onChange={handleTagSelect}
          placeholder="-- Search Tags --"
        >
          {options =>
            options.map(item => (<span key={item.sys.id}>{item.name} ({item.sys.id})</span>))
          }
        </Autocomplete>        
      </div>
    )
  }

  /**
   * Build the dropdown of operators conditionally based on field type
   * @return {str}
   */
  const generateOperatorSelect = () => {
    const options = []
    for (const [key, value] of Object.entries(operations)) {
      options.push(<Option key={key} value={value}>{key}</Option>)
    }
    return (
      <div>
        <FormLabel>Condition</FormLabel>
        <Select width="full" value={operator} onChange={event => handleOperatorSelect(event)}>
          <Option value="">-- Select A Condtion --</Option>
          {options}
        </Select>
      </div>
    )
  }

  return (
    <Grid columns={3} style={{ "width": "100%" }}>
      {entryQuery.content_type && generateFieldSelect()}
      <div>
        <FormLabel>Selected</FormLabel>
        <div>
          {selectedTags.map(tag => {
            return (
              <Pill
                key={tag.sys.id}
                label={tag.name}
                onClose={() => handleRemoveTag(tag)}
                className="f36-margin-right--xs f36-margin-bottom--xs"
              />
            )
          })}   
        </div>     
      </div>
      {selectedTags.length > 0 && generateOperatorSelect()}
    </Grid>
  )

}

export default FilterByTags