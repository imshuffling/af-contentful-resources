import { useState, useEffect, useCallback } from 'react'

import { Select, Option, Paragraph, Spinner, ValidationMessage, Flex, FormLabel, Button, IconButton, TextField, CopyButton, Tabs, Tab,
Dropdown, DropdownList, DropdownListItem, Card, Typography } from '@contentful/forma-36-react-components'

import { locations } from '@contentful/app-sdk'

const Dialog = ({ sdk, initialValue, updateValue, appParameters }) => {

  console.log(sdk.parameters.invocation);

  const contentTypes = sdk.parameters.invocation.contentTypes

  console.log(contentTypes);


  const handleAddExisting = () => {
    console.log('handleAddExisting')

    sdk.dialogs
      .selectSingleEntry({
        // contentTypes: contentTypes,
        contentTypes: 'snippet',
      })
      .then((result) => {
        console.log('result', result);
        sdk.close(result)
          // const field = sdk.field.getValue()
          
          // console.log('field', field);

          // sdk.field.setValue(result);
          // const field = sdk.field.iterableObject
          // field.setValue(data)
      });
  }


  const handleAddNew = contentType => {
    console.log('Clicked', contentType)

    if (!contentType) {
      console.log('nada')
      return
    }
    // console.log('Clicked')

    sdk.navigator
      .openNewEntry(
        contentType
      )
      .then((result) => {
        console.log(result);
      });
  }

  const [isOpen, setOpen] = useState(false);

  const placeholder = (<Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.</Paragraph>)

  return (
    <div className="demo">
      <Flex>
      <Button onClick={handleAddExisting}>Select From Existing</Button>
      <Paragraph>Or</Paragraph>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        usePortal={false}
        toggleElement={
          <Button
            // size="small"
            // buttonType="muted"
            indicateDropdown
            onClick={() => setOpen(!isOpen)}
          >
            Add New
          </Button>
        }
        >
          <DropdownList maxHeight={200}>
            {contentTypes.map(entry => (                
                <DropdownListItem key={entry} onClick={() => handleAddNew(entry)}>
                  Entry Item {entry}
                </DropdownListItem>
              ))}
          </DropdownList>

      </Dropdown>
      </Flex>
    </div>
  )
}

export default Dialog