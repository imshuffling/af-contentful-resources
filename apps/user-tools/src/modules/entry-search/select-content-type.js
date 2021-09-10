import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context'
import { generateToken } from '../../library/utilities'
import FilterByFields from './filter-by-fields'
import FilterByTags from './filter-by-tags'

import {
  Select,
  Option,
  Flex,
  Button,
  IconButton
} from '@contentful/forma-36-react-components'

const SelectContentType = () => {

  // Grab app context
  const { sdk, updateEntryQuery } = useContext(AppContext)

  // Set state for this module
  const [contentTypes, setContentTypes] = useState([])
  const [contentType, setContentType] = useState()
  const [filters, setFilters] = useState([])
  const [tagFilter, setTagFilter] = useState()

  /**
   * Get all content types from space
   * @return {null}
   */
  useEffect(() => {
    const response = sdk.space.getContentTypes({ "order": "name" })
    response.then(res => {
      if (res.items && Array.isArray(res.items)) {
        setContentTypes(res.items)
      }
    })
  }, [])

  /**
   * Set query for content_type
   * @param  {obj} event
   * @return {null}
   */
  const handleSelectContentType = event => {
    const id = event.target.value

    // Reset to default
    if (!id) {
      updateEntryQuery('content_type', null)
      setContentType()
      return
    }

    // Remove old filters
    if (filters.length > 0) {
      for (const item of filters) {
        const key = Object.keys(item)[0]
        handleRemoveFilter(key)
      }
    }

    // Query SDK to get selected content_type data and updata app context
    const response = sdk.space.getContentType(id)
    response.then(res => {
      setContentType(res)
      updateEntryQuery('content_type', res.sys.id)
    })
  }

  /**
   * Add another filter row (fields or tags only)
   * NOTE: Only 1 tag filter option is allowed
   * @param  {str} type
   * @return {null}
   */
  const handleAddFilter = type => {
    switch (true) {
      case type === 'field':
        setFilters(prevState => {
          return (
            [ ...prevState, { [generateToken()]: <FilterByFields /> } ]
          )
        })
        break
      case type === 'tag':
        const token = generateToken()
        
        // Save tag filter id to keep it singular/unique
        setTagFilter(token)
        setFilters(prevState => {
          return (
            [ ...prevState, { [token]: <FilterByTags /> } ]
          )
        })
        break
    }    
  }

  /**
   * Remove targeted filter row
   * @return {null}
   */
  const handleRemoveFilter = id => {

    // If removing tag filter, reset
    if (id === tagFilter) setTagFilter()

    setFilters(prevState => {
      const array = prevState.filter(item => {
        const key = Object.keys(item)[0]
        return key !== id
      })
      return (
        [ ...array ]
      )
    })
  }

  /**
   * Build dropdown for content types
   */
  const contentTypeSelect = (
    <Flex>
      <Select
        id="optionSelect"
        width="large"
        name="optionSelect" onChange={(event) => handleSelectContentType(event)}
      >
        <Option value="">-- Select A Content Type --</Option>
        {contentTypes.map(row => {
          return (
            <Option key={row.sys.id} value={row.sys.id}>{row.name}</Option>
          )
        })}
      </Select>
      <Button
        onClick={() => handleAddFilter('field')}
        disabled={contentType ? false : true}
        buttonType="muted"
        className="f36-margin-left--l"
      >
        Add Field Filter
      </Button>
      <Button
        onClick={() => handleAddFilter('tag')}
        disabled={contentType && !tagFilter ? false : true}
        buttonType="muted"
        className="f36-margin-left--l"
      >
        Add Tags Filter
      </Button>
    </Flex>
  )

  /**
   * Build filter list options
   */
  const filtersDisplay = (
    <div className="filter-wrapper f36-margin-top--m">
      {filters.map(row => {
        const key = Object.keys(row)[0]
        const value = Object.values(row)[0]
        return (
          <Flex padding="spacingS" key={key}>
            {value}
            <IconButton
              buttonType="muted"
              iconProps={{
                icon: 'Delete',
                size: 'small'
              }}
              onClick={() => handleRemoveFilter(key)}
              style={{
                marginTop: '24px',
                marginLeft: '10px'
              }}
            />
          </Flex>
        )
      })}
    </div>
  )

  return (
    <>
      {contentTypeSelect}
      {filters.length > 0 && filtersDisplay}
    </>
  )
  
}

export default SelectContentType