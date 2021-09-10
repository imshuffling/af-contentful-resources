import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context'
import { formatDate } from '../../library/utilities'

import {
  Paragraph,
  Button,
  Spinner,
  ValidationMessage,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@contentful/forma-36-react-components'

const DisplayResults = () => {

  // Grab app context
  const { sdk, entryQuery } = useContext(AppContext)

  // Set state for this module
  const [results, setResults] = useState([])
  const [displayField, setDisplayField] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState()

  /**
   * Reset fields on content_type change and get display data from content_type data
   * @return {null}
   */
  useEffect(() => {
    setResults([])
    if (!entryQuery.content_type) return    
    const response = sdk.space.getContentType(entryQuery.content_type)
    response.then(res => {
      if (res.displayField && res.displayField !== undefined) {
        setDisplayField(res.displayField)
      }
    })
  }, [entryQuery.content_type])

  /**
   * Query SDK to find target entries and set to state for display
   * @return {null}
   */
  const handleFindEntries = () => {
    setIsLoading(true)
    setMessage()
    const response = sdk.space.getEntries(entryQuery)
    response.then(res => {

      // Only set if items found
      if (res.items && Array.isArray(res.items) && res.items.length > 0) {
        setResults(res)
      } else {
        setMessage('No entries found.')
      }

    })
    .catch(err => {
      setMessage('There was an error retrieving results.')
    })
    .then(() => {
      setIsLoading(false)
    })
  }

  /**
   * Build the display table of found entries based on query data
   * @return {str}
   */
  const generateDisplayTable = () => {
    const resultItems = results && results.items ? results.items : []
    if (resultItems.length > 0) {
      return (
        <>
          <div
            className="f36-margin-bottom--s"
            style={{ "textAlign": "right" }}
          >
            <Paragraph>Displaying: {resultItems.length} / {results.total}</Paragraph>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultItems.map(row => {
                console.log('row', row);
                return (
                  <TableRow key={row.sys.id}>
                    <TableCell>{row.fields[displayField]['en-US'] && row.fields[displayField]['en-US']}</TableCell>                    
                    <TableCell>{row.sys.id && row.sys.id}</TableCell>
                    <TableCell>{row.sys.version && row.sys.version}</TableCell>
                    <TableCell>{row.sys.createdAt && formatDate(row.sys.createdAt, 'M j, Y, g:i a')}</TableCell>
                    <TableCell>{row.sys.updatedAt && formatDate(row.sys.updatedAt, 'M j, Y, g:i a')}</TableCell>
                    <TableCell>{row.metadata.tags && row.metadata.tags.map(tag => tag.sys.id).join(', ')}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      )
    }
  }

  /**
   * Loading UI during query
   */
  const spinner = (
    <Spinner
      size="large"
      style={{ "display": "block" }}
    />
  )

  return (
    <div className="f36-margin-top--l">
      <Button
        onClick={handleFindEntries}
        disabled={!entryQuery.content_type ? true : false}
        className="f36-margin-bottom--s"
      >
        Find Entries
      </Button>
      {isLoading && spinner}
      {message && <ValidationMessage>{message}</ValidationMessage>}
      {!message && generateDisplayTable()}
    </div>    
  )  
}

export default DisplayResults