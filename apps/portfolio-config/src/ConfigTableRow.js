import { useState, useEffect } from 'react'
import { TableRow, TableCell, Icon, Select, Option, TextInput, RadioButton, ModalConfirm } from '@contentful/forma-36-react-components'

const ConfigTableRow = ({ index, data, keys, dateFormats, defaultSort, defaultDirection, updateColumns, removeRow }) => {

  /**
   * Map date type column to appropriate keys for dropdown
   */
  let initialFormat = data.type ? data.type : ''
  if (initialFormat && data.format) {
    const target = dateFormats.filter(date => {
      return date.value === data.format
    })
    initialFormat = target.length > 0 && target[0].key ? target[0].key : ''
  }

  /**
   * Input state
   */
  const [columnKey, setColumnKey] = useState(data.name ? data.name : '')
  const [columnLabel, setColumnLabel] = useState(data.label ? data.label : '')
  const [columnFormat, setColumnFormat] = useState(initialFormat)
  const [sortDirection, setSortDirection] = useState(defaultSort === data.name && defaultDirection ? defaultDirection : '')
  const [sortByChecked, setSortByChecked] = useState(defaultSort === data.name ? true : false )

  /**
   * Set state for display elements
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * Push update to parent on state change
   */
  useEffect(() => {
    handleInputChange()
  }, [columnKey, columnLabel, columnFormat, sortDirection])

  /**
   * Process an the config data from the row and push up to parent
   */
  const handleInputChange = () => {

    // Minimal required data
    let rowConfig = {
      name: columnKey,
      label: columnLabel
    }

    // Set type from format
    const type = columnFormat ? columnFormat : null
    if (type) rowConfig = { ...rowConfig, type }

    // Fire update in parent
    updateColumns()

  }

  /**
   * Generate dropdown of selectable keys for columns
   */
  const columnSelect = (
    <Select
      name="name"
      value={columnKey}
      onChange={(event) => setColumnKey(event.target.value)}
    >
      <Option value="">Select Data Key</Option>
      {keys.map(key => {
        return (
          <Option key={key} value={key}>{key}</Option>
        )
      })}
    </Select>
  )  

  /**
   * Predefined list of format options
   */
  const formatSelect = (
    <Select
      name="type"
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
    <Select
      name="defaultDirection"
      value={sortDirection}
      onChange={(event) => setSortDirection(event.target.value)}
    >
      <Option value="">Default</Option>
      <Option value="desc">Descending</Option>
      <Option value="asc">Ascending</Option>
    </Select>
  )

  return (
    <>
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
        <TableCell align="center">
          <RadioButton
            name="defaultSort"
            value={columnKey}
            onClick={handleInputChange}
            checked={defaultSort === data.name && true}
          />
        </TableCell>
        <TableCell>{directionSelect}</TableCell>
        <TableCell>
          <input type="hidden" name="reset" value={true} />
          <Icon icon="Delete"
            className="remove"
            onClick={() => setShowModal(true)}
         />
        </TableCell>            
      </TableRow>
      <ModalConfirm
        isShown={showModal}
        intent="negative"
        title="Remove Row"
        onClose={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false)
          removeRow(index)
        }}
      >
       Are you sure you want to remove this row?
      </ModalConfirm>
    </>
  )
}

export default ConfigTableRow