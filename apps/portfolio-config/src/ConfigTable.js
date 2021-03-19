import { useState, useEffect, useRef } from 'react'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@contentful/forma-36-react-components'

import ConfigTableRow from './ConfigTableRow'

/**
 * Data format options
 */
const dateFormats = [
  {
    key: 'date1',
    value: 'F j, Y',
    label: 'Date (Month Day, Year)'
  },
  {
    key: 'date2',
    value: 'm/d/Y',
    label: 'Date (MM/DD/YYYY)'
  },
  {
    key: 'date3',
    value: 'm-d-Y',
    label: 'Date (MM-DD-YYYY)'
  },
  {
    key: 'date4',
    value: 'Y-m-d',
    label: 'Date (YYYY-MM-DD)'
  }
]

const ConfigTable = ({ data, type, keys, defaultSort, defaultDirection, updateStatusConfig }) => {

  /**
   * Set data states and initial refs
   */
  const [columnConfigData, setColumnConfigData] = useState([])
  const tableForm = useRef(null);

  /**
   * Pass through to imitate form submit and grab all rows of fields
   */
  const updateColumns = () => {
    tableForm.current.requestSubmit()    
  }

  /**
   * Remove a target field from the config
   */
  const removeRow = index => {
    setColumnConfigData(prevState => {
      prevState[type].splice(index, 1)
      updateStatusConfig(prevState)
      return prevState
    })
  }

  /**
   * Interrupt form submit and format data for config
   * Treated as a faux submit
   */
  const handleOnSubmit = event => {
    
    // Stop actual form progression
    event.preventDefault()    

    // Create form data from rows of data
    const formData = new FormData(event.target)

    // Format form data into array of data objects by row by using a hidden input flag
    const rows = []
    let tempObject = {}
    let defaultSort = null
    let defaultDirection = null
    for (const entry of formData.entries()) {

      // Set mutable key var
      let key = entry[0]

      // At the end of the row, append to array and start over
      if (entry[0] === 'reset') {
        rows.push(tempObject)
        tempObject = {}
        continue
      }

      // Set date format if selected for type
      let format = null
      if (entry[0] === 'type' && entry[1].includes('date')) {

        // Use format from date config object
        const target = dateFormats.filter(date => {
          return date.key === entry[1]
        })

        // Append to temp obj
        if (target && target[0].value) tempObject = { ...tempObject, format: target[0].value }
      }

      // If row is selected as default sort, append to temp object and save for config
      if (entry[0].includes('defaultSort')) {
        key = 'defaultSort'
        defaultSort = entry[1]
      }

      // If row selected for sort and option is selected, save for congi
      if (tempObject.defaultSort && entry[0] === 'defaultDirection' && entry[1]) defaultDirection = entry[1]

      // Build row data object      
      const value = entry[1].includes('date') ? 'date' : entry[1]
      tempObject = {
        ...tempObject,
        [key]: value
      }

    }

    // Remove empty key/value pairs (assume default)
    for (const row of rows) {
      for (const [key, value] of Object.entries(row)) {
         if (!value) delete row[key]
      }
    }

    // Pass update to parent config
    if (rows.length > 0) {

      // Cleanup
      defaultSort = defaultSort ? { defaultSort: defaultSort } : null
      defaultDirection = defaultSort && defaultDirection ? { defaultDirection: defaultDirection } : null

      // Merge data and update local and parent states
      const mergedData = {
        ...defaultSort,
        ...defaultDirection,
        [type]: rows
      }
      setColumnConfigData(mergedData)
      updateStatusConfig(mergedData)
    }

  }

  /**
   * Build rows from from data
   */
  const rows = []
  let index = 0
  for (const row of data) {
    rows.push(
      <ConfigTableRow
        key={`${row.name}-${index}`}
        index={index}
        data={row}
        keys={keys}
        dateFormats={dateFormats}
        defaultSort={defaultSort}
        defaultDirection={defaultDirection}
        updateColumns={updateColumns}
        removeRow={removeRow}
      />
    )
    index++
  }

  return (
    <form
      ref={tableForm}
      onSubmit={event => handleOnSubmit(event)}
      style={{ width: '100%' }}
      >
      <Table className="config-table f36-margin-bottom--s">
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Format</TableCell>
            <TableCell>Sort By</TableCell>
            <TableCell>Direction</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </form>
  )
}

export default ConfigTable