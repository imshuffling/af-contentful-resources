import { useState, useEffect, useCallback } from 'react'

import { Select, Option, Paragraph, Spinner, ValidationMessage, Flex, FormLabel, Button, IconButton, TextField, CopyButton, Tabs, Tab,
Dropdown, DropdownList, DropdownListItem, Card, Typography, TextLink } from '@contentful/forma-36-react-components'

import { locations } from '@contentful/app-sdk'

const Demo = ({ sdk, initialValue, updateValue, appParameters }) => {

  sdk.window.startAutoResizer()

  console.log('sdk', sdk);
  console.log('appParameters', );

  // sdk.field.setValue({ "id": "test" })

  // List of content that can be linked
  const contentTypes = appParameters.contentTypes.replace(/ /g,'').split(',')

  const [state, setState] = useState('')
  const handleAddExisting = () => {
    console.log('handleAddExisting')

    sdk.dialogs
      .selectSingleEntry({
        // contentTypes: contentTypes,
        contentTypes: 'snippet',
      })
      .then((result) => {
        console.log(result);
          const field = sdk.field.getValue()
          
          console.log('field', field);

          sdk.field.setValue(result);
          // const field = sdk.field.iterableObject
          // field.setValue(data)
      });
  }


    //   const field = sdk.entry.fields.iterableObject
  //   field.setValue(data)


  const handleAddNew = contentType => {
    console.log('Clicked', contentType)

    if (!contentType) {
      console.log('nada')
      return
    }
    // console.log('Clicked')

    sdk.navigator
      .openNewEntry(
        contentType,
        { slideIn: { waitForClose: true } }
      )
      .then((result) => {
        console.log(result);
      });
  }

  const structure = [
    {
      "id": "dynamic_content_12456",
      "type": "reference",
      "view": "web",
      "content": "6VcyGK805uIdDFwDDOW3ff"
    },
    {
      "id": "dynamic_content_78910",
      "type": "snippet",
      "view": "email",
      "content": "Content/ad/html/embed content...."
    },
    {
      "id": "dynamic_content_78910",
      "type": "snippet",
      "view": "default",
      "content": "Content/ad/html/embed content...."
    }
  ]

  const options = (
    contentTypes.map(item => {
      return (
        <Option key={item} value={item}>Add new {item}</Option>
      )
    })
  )


  const [isOpen, setOpen] = useState(false);

  console.log('isOpen', isOpen);

  const handleDropclick = () => {
    console.log('hi');

    sdk.dialogs
    .openCurrentApp({
      title: "Select Or Add",
      allowHeightOverflow: true,
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      minHeigh: 500,
      parameters: { contentTypes: contentTypes }
    })
    // .openCurrentApp({
    //   title: 'My question',
    //   message: 'What is your answer?',
    //   intent: 'positive',
    //   confirmLabel: 'Yes!',
    //   cancelLabel: 'No...',
    // })
    .then((data) => {
      console.log('from prompts', data);
      /* ... */
    });
  }


    if (sdk.location.is(locations.LOCATION_DIALOG)) {
    return (
      <>
        <h1>PROMPT</h1>
        </>
      )
  }

  const placeholder = (<Paragraph>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.</Paragraph>)

  return (
    <div className="demo">
      {/* {placeholder} */}
      <Flex>
        <TextLink icon="PlusCircle">Add new dynamic content</TextLink>
      </Flex>
      {/* <Flex marginTop="spacingM"> */}
      <div className="f36-margin-top--m">
        <Card>
        <Button onClick={handleDropclick} size="small" icon="Search">Choose from exisiting</Button>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        
        <Dropdown
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          usePortal={true}
          position="right"
          toggleElement={
            <Button
              size="small"
              // buttonType="muted"
              indicateDropdown
              onClick={() => setOpen(!isOpen)}
            >
              Create New
            </Button>
          }
          >
            <DropdownList maxHeight={120}>
              {/* <DropdownListItem isTitle>New Content</DropdownListItem> */}
              {/* <DropdownListItem> */}
              {/*   Add exisiting content */}
              {/* </DropdownListItem> */}
              {contentTypes.map((entry, index) => (
                  
                  <DropdownListItem key={`key-${index}`} onClick={handleDropclick}>
                    Add new {entry}
                  </DropdownListItem>
                ))}
            </DropdownList>

        </Dropdown>
        </Card>
      </div>
      <div className="f36-margin-top--m">
        <Card>
          <TextField
            value="embed_546814cd"
            name="embed"
            id="embed"
            labelText="Embed Code"
            textInputProps={{
              disabled: true,
            }}
          />
          <CopyButton />
          <Button
              size="small"
              buttonType="negative"
              onClick={() => setOpen(!isOpen)}
            >
              Remove
            </Button>
        </Card>
      </div>
      {/* {placeholder} */}
      {/* {placeholder} */}
      {/* {placeholder} */}
      {/* <Select> */}
      {/*   <Option>1</Option> */}
      {/*   <Option>2</Option> */}
      {/*   <Option>3</Option> */}
      {/*   <Option>4</Option> */}
      {/*   <Option>1</Option> */}
      {/*   <Option>1</Option> */}
      {/*   <Option>1</Option> */}
      {/* </Select> */}
      {/* <br /> */}
      {/* <br /> */}
      {/* <br /> */}
      {/* <br /> */}
      {/* <br /> */}
      {/* <br /> */}
      {/* <br /> */}
      {/* <Paragraph>hi</Paragraph> */}
      {/* <Paragraph>hi</Paragraph> */}
      {/* <Paragraph>hi</Paragraph> */}
      {/* <Paragraph>hi</Paragraph> */}
      {/* <Paragraph>hi</Paragraph> */}
      {/* <Paragraph>hi</Paragraph> */}
      {/*  
      <Flex marginTop="spacingM">
        <TextField
          value="embed_546814cd"
          name="embed"
          id="embed"
          labelText="Embed Code"
          textInputProps={{
            disabled: true,
          }}
        />
        <CopyButton />
      </Flex>
      <Flex marginTop="spacingM">
        <TextField
          value=""
          name="content"
          id="content"
          labelText="Content"
          helpText="Some content"
          // onChange={event => updateValue(`${field.key}`, event.target.value)}
          textarea
          required
        />
      </Flex>
      <Flex marginTop="spacingM">
        <div>
          <FormLabel htmlFor="reference" required>Link to existing entry</FormLabel>
        </div>
        <Flex>
          <Button onClick={handleAddExisting}>Add existing content</Button>
          <Select value="" name="select" onChange={event => handleAddNew(event.target.value)}>
            <Option value="">Add new content</Option>
            {options}
          </Select>
        </Flex>
      </Flex>
      <Paragraph>{state}</Paragraph>
      */}
    </div>
  )
}

export default Demo