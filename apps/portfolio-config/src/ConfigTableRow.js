import { useState, useEffect } from 'react'
import { TableRow, TableCell, Icon, Select, Option, TextInput,   RadioButton, Modal } from '@contentful/forma-36-react-components'

const ConfigTableRow = ({ data, keys, updateColumns }) => {

  const [columnKey, setColumnKey] = useState()
  const [columnLabel, setColumnLabel] = useState()
  const [columnFormat, setColumnFormat] = useState()

  useEffect(() => {

    let rowConfig = {
      name: columnKey,
      label: columnLabel
    }

    const type = columnFormat ? columnFormat : null
    if (type) rowConfig = { ...rowConfig, type }

    let format = null
    if (columnFormat && columnFormat.includes('date')) {
      const target = dateFormats.filter(date => {
        return date.key === columnFormat
      })
      if (target && target[0].value) rowConfig = { ...rowConfig, format: target[0].value }
    }

    updateColumns(rowConfig)

  }, [columnKey, columnLabel, columnFormat])

  /**
   * Generate dropdown of selectable keys for columns
   */
  const columnSelect = (
    <Select
      name="columnSelect"
      value={columnKey}
      onChange={(event) => setColumnKey(event.target.value)}
    >
      <Option value="">Select Data Key</Option>
      {keys.map(element => {
        return (
          <Option value={element}>{element}</Option>
        )
      })}
    </Select>
  )

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

  /**
   * Predefined list of format options
   */
  const formatSelect = (
    <Select
      name="formatSelect"
      value={columnFormat}
      onChange={(event) => setColumnFormat(event.target.value)}
    >
      <Option value="">Default</Option>
      <Option value="currency">Currency</Option>
      <Option value="percentage">Percentage</Option>
      {dateFormats.map(row => <Option key={row.key} value={row.key}>{row.label}</Option>)}
    </Select>
  )

  /**
   * Sorting direction
   */
  const directionSelect = (
    <Select>
      <Option value="">Default</Option>
      <Option value="asc">Ascending</Option>
      <Option value="desc">Descending</Option>
    </Select>
  )

  // Remove modal
  const [isShown, setShown] = useState(false);
  const handleModal = () => {
    // setShown(true)
    alert('Remove')
  }

  return (
    <TableRow>
      <TableCell>{columnSelect}</TableCell>
      <TableCell>
        <TextInput
          name="label"
          value={columnLabel}
          placeholder="Column Label"
          onChange={(event) => setColumnLabel(event.target.value)}
        />
      </TableCell>
      <TableCell>{formatSelect}</TableCell>
      <TableCell>
        <RadioButton name="sortBy" />
      </TableCell>
      <TableCell>{directionSelect}</TableCell>
      <TableCell>
        <Icon icon="Delete"
          className="remove"
          onClick={handleModal}
       />
      </TableCell>            
    </TableRow>
  )
}

export default ConfigTableRow