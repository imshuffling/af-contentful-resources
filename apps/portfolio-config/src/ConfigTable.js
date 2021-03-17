import { useState, useEffect } from 'react'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@contentful/forma-36-react-components'

import ConfigTableRow from './ConfigTableRow'

const ConfigTable = ({ type, data, keys, updateStatusConfig }) => {

  const [columnConfigData, setColumnConfigData] = useState([])

  // console.log('columnConfigData', columnConfigData);

  const updateColumns = update => {

    //// WE NEED TO STOP AND GET ALL ROWS FOR THIS TABLE

    // Merge update and current state
    const mergedConfig = [
      ...columnConfigData,
      update
    ]

    // Update local state
    setColumnConfigData(mergedConfig)

    // Append merged to group Id for top level config
    updateStatusConfig({
      [type]: mergedConfig
    })
    
  }

  /**
   * Build rows from from data
   */
  const rows = []
  for (const row of data) {
    rows.push(
      <ConfigTableRow
        key={row.key}
        data={row.key}
        keys={keys}
        updateColumns={updateColumns}
      />
    )
  }

  return (
    <Table className="config-table f36-margin-bottom--s">
      <TableHead>
        <TableRow>
          <TableCell>Data</TableCell>
          <TableCell>Label</TableCell>
          <TableCell>Format</TableCell>
          <TableCell>Sort</TableCell>
          <TableCell>Direction</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  )
}

export default ConfigTable