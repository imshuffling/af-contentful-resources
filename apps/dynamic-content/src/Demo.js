import { useState, useEffect } from 'react'
import {
  Paragraph,
  Spinner,
  ValidationMessage,
  Flex,
  FormLabel,
  TextField,
  CopyButton,
  Card,
  Typography,
  TextLink,
  CardActions,
  DropdownList,
  DropdownListItem,
  Tag,
  HelpText
} from '@contentful/forma-36-react-components'

const Demo = ({ sdk }) => {

  /**
   * Set state/constants
   */
  const contentType = sdk.parameters.instance.dynamicContentType
  const locale = 'en-US'
  const [entries, setEntries] = useState([])
  const [showDuplicateMessage, setShowDuplicateMessage] = useState(false)
  const [refresh, forceRefresh] = useState(false)


  /**
   * On initial load, query entry for dynamic embeds and populate the field
   */
  useEffect(() => {

    // Ignore new posts
    if (entries.length > 0) return

      // Get the field data
      var targetField = sdk.entry.fields.dynamicContent.getValue();

      // If available, built array of ids for query
      if ( targetField ) {
        const array = targetField.map(entry => entry.sys.id)
        const data = sdk.space.getEntries(
          {
            'sys.id[in]': array
          }
        )
        data.then(res => {
          setEntries(res.items)
        })
      }

  }, [])


  /**
   * If entries exisit or have increased, update the value
   */
  useEffect(() => {
    if (entries.length > 0) setDataValues()
  }, [entries])

  /**
   * Set the field value for publishing
   * @return {[type]} [description]
   */
  const setDataValues = () => {
    
    // Build array of references for update
    const updatedData = entries.map(entry => {
      return {
        "sys": {
            "type": "Link",
            "linkType": "Entry",
            "id": entry.sys.id
        }
      }
    })

    // Set value for publishing
    sdk.field
    .setValue(updatedData)
    .then((result) => {})
    .catch((error) => {
      console.log('Error', error);
    })

  }

  /**
   * Create a new reference via SDK
   */
  const handleAddNew = () => {

    // Remove error messages
    setShowDuplicateMessage(false)

    // Fire injection function
    sdk.navigator
      .openNewEntry(
        contentType,
        { slideIn: { waitForClose: true } }
      )
      .then((result) => {

        // Drop if no result or canceled entry
        if (!result || !result.entity) return

        // Update entries  
        setEntries(prevState => {
          return [
            ...prevState,
            result.entity
          ]
        })


      });
  }

  /**
   * Add reference to existing content via SDK
   */
  const handleAddExisting = () => {

    // Remove error messages
    setShowDuplicateMessage(false)

    // Show finder dialog
    sdk.dialogs
      .selectSingleEntry({
        locale: locale,
        contentType: contentType
      })
      .then((result) => {

        // Drop if no result
        if (!result) return

        // Find if selected entry is already in the queue
        const found = entries.find(item => {
          return item.sys.id === result.sys.id
        })

        // Updata entries, otherwise, show error about duplicates
        if (!found) {
          setEntries(prevState => {
            return [
              ...prevState,
              result
            ]
          })
        } else {
          setShowDuplicateMessage(true)
        }
      })
  }

  /**
   * Use SDK to show slide in of referenced item and allow edits
   * @param  {str} id [description]
   */
  const handleEditSelected = id => {

    // ID required
    if (!id) return

    // Remove error messages
    setShowDuplicateMessage(false)

    // show editor dialog
    sdk.navigator
      .openEntry(
        id,
        { slideIn: { waitForClose: true } }
      )
      .then((result) => {
        
        // Drop if no result
        if (!result) return

        // Get location of edited entry
        const index = entries.findIndex(item => {
          return item.sys.id === result.entity.sys.id
        })

        // Create duplicate and update state
        let tempArray = entries
        tempArray[index] = result.entity
        setEntries(tempArray)

        // Force an update with delayed forced refresh
        setTimeout(() => { forceRefresh(!refresh) }, 2000)

      })
  }

  /**
   * Remove referenced item and update state and value
   * @param  {str} id [description]
   */
  const handleRemoveSelected = id => {

    // ID required
    if (!id) return

    // Remove error messages
    setShowDuplicateMessage(false)

    // Create duplicate data of current before modifying state
    const workingEntries = [ ...entries ]

    // Get location of removed entry
    const index = workingEntries.findIndex(item => {
      return item.sys.id === id
    })

    // Create duplicate, extract entry from array and update state
    let tempArray = workingEntries
    if (index > -1) tempArray.splice(index, 1)
    setEntries(tempArray)
  }


  /**
   * Build display dynamic content items
   */
  const embeds = entries.map(entry => {

    // Conditionally check for entry status
    let status
    switch (true) {
      case !entry.sys.publishedVersion:
        status = 'draft'
        break
      case !!entry.sys.publishedVersion && entry.sys.version >= entry.sys.publishedVersion + 2:
        status = 'changed'
        break
      case !!entry.sys.archivedVersion:
        status = 'archived'
        break
      default:
        status = 'published'
        break;
    }

    return (
      <Flex marginTop="spacingM" key={entry.sys.id}>
        <Card style={{"width":"100%"}}>
          <Flex justifyContent="space-between">
            <Flex justifyContent="space-between" style={{'width': '100%', 'marginRight': '10px'}}>
              <FormLabel>{entry.fields.title ? entry.fields.title[locale] : 'Untitled'}</FormLabel>
              <Tag entityStatusType={status}>{status}</Tag>
            </Flex>
            <CardActions position="left">
              <DropdownList>
                <DropdownListItem onClick={() => handleEditSelected(entry.sys.id)}>Edit</DropdownListItem>
                <DropdownListItem onClick={() => handleRemoveSelected(entry.sys.id)}>Remove</DropdownListItem>
              </DropdownList>
            </CardActions>
          </Flex>
          <Flex alignItems="flex-end" justifyContent="space-between">
            <TextField
              value={entry.fields.slug ? `{{${entry.fields.slug[locale]}}}` : 'undefined'}
              name="embed"
              id="embed"
              width="full"
              textInputProps={{
                disabled: true,
              }}
            />
            <CopyButton
              copyValue={entry.fields.slug ? `{{${entry.fields.slug[locale]}}}` : ''}
              style={{"marginLeft":"10px"}} />            
          </Flex>
        </Card>
      </Flex>
    )
  })

  return (
    <div className="demo">
      <Flex>
        <HelpText>Create dynamic content embeds by adding snippets to this entry. Copy the bracketed tokens and paste into the main content area.</HelpText>
      </Flex>
      <Flex marginTop="spacingM">
        <TextLink icon="Search" onClick={handleAddExisting}>Choose from exisiting</TextLink>
        <Paragraph style={{"marginLeft": "10px", "marginRight": "10px"}}>– or -</Paragraph>
        <TextLink icon="PlusCircle" onClick={handleAddNew}>Create new</TextLink>
      </Flex>
      <Flex marginTop="spacingM" flexDirection="column">
        {showDuplicateMessage && <ValidationMessage>Cannot have duplicate choices.</ValidationMessage>}
        {embeds}
      </Flex>
    </div>
  )
}

export default Demo