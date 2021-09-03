import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context'
import { formatDate } from '../../library/utilities'

import {
  Select,
  Option,
  Paragraph,
  Flex,
  TextInput,
  FormLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner
} from '@contentful/forma-36-react-components'

const DisplayResults = () => {

  const { sdk, updateEntryQuery, entryQuery } = useContext(AppContext)

  const [results, setResults] = useState([])
  


  const tempFindEntries = () => {    
    const foobar = sdk.space.getEntries(entryQuery)
    foobar.then(res => {
      if (res.items && Array.isArray(res.items)) {
        console.log('res', res);
        setResults(res)
      }
    })
  }

  const resultItems = results && results.items ? results.items : []

  return (
    <>
      <br />
      <br />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {resultItems.map(row => {
            return (
              <TableRow key={row.sys.id}>
                {/* <TableCell>{row.fields[displayField]['en-US'] && row.fields[displayField]['en-US']}</TableCell> */}
                <TableCell>{row.fields.title['en-US'] && row.fields.title['en-US']}</TableCell>
                <TableCell>{row.sys.id && row.sys.id}</TableCell>
                <TableCell>{row.sys.version && row.sys.version}</TableCell>
                <TableCell>{row.sys.createdAt && formatDate(row.sys.createdAt, 'M j, Y, g:i a')}</TableCell>
                <TableCell>{row.sys.updatedAt && formatDate(row.sys.updatedAt, 'M j, Y, g:i a')}</TableCell>
              </TableRow>
            )
          })}


        </TableBody>
      </Table>
      <br />
      <br />
      <Button buttonType="nude" onClick={tempFindEntries}>Find Entries</Button>
    </>
  )  
}

export default DisplayResults