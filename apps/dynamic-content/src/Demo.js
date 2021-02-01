import { useState, useEffect, useCallback } from 'react'

import { Select, Option, Paragraph, Spinner, ValidationMessage, Flex, FormLabel, Button, IconButton, TextField, CopyButton, Tabs, Tab,
Dropdown, DropdownList, DropdownListItem, Card, Typography, TextLink, EntryCard, CardActions, Heading, Tag } from '@contentful/forma-36-react-components'

import { locations } from '@contentful/app-sdk'

const Demo = ({ sdk, initialValue, updateValue, appParameters }) => {


  console.log('sdk', sdk);

  

  // List of content that can be linked
  const contentTypes = appParameters.contentTypes.replace(/ /g,'').split(',')
  const locale = 'en-US'


  const [entries, setEntries] = useState([])
  const [foobar, setFoobar] = useState('foo')
  const [duplicateMessage, setDuplicateMessage] = useState(false)
  const [dummy, setDummy] = useState(false)
  console.log('after state entries', entries);
  // console.log('foobar', foobar);


  useEffect(() => {

    console.log('start prefil');
    if (entries.length > 0) return

      // var targetField = sdk.entry.fields.dynamicContentOLD;
      var targetField = sdk.entry.fields.dynamicContent.getValue();
      console.log('cur value2', targetField);

      if ( targetField ) {

        const array = targetField.map(entry => entry.sys.id)
        console.log('array', array);

        // const data = sdk.space.getEntry(targetField[0].sys.id)
        const data = sdk.space.getEntries(
          {
            'sys.id[in]': array
          }
        )
        data.then(res => {
          setEntries(res.items)
          console.log('list', res.items);
        })
      }

  }, [])


//   useEffect(() => {
//     console.log('start process');
//     if (entries.length > 0) {
//       console.log('update');
// 
//       sdk.field
//       .setValue([{
//                 "sys": {
//                     "type": "Link",
//                     "linkType": "Entry",
//                     "id": entries[0].sys.id
//                 }
//             }])
//       .then((data) => {
//         console.log('1', data); // Returns "foo".
//       })
//       .catch((err) => {
//         console.log('2', err);
//       })
//       .then(()=> {
//         console.log('force re-render');
//         setDummy(!dummy)
//       })
// 
//     }
//   }, [entries])


  useEffect(() => {
    if (entries.length > 0) setDataValues()
  }, [entries])


  const setDataValues = () => {
    const updateValues = entries.map(entry => {
      console.log('entry', entry);
      return {
        "sys": {
            "type": "Link",
            "linkType": "Entry",
            "id": entry.sys.id
        }
      }
    })
    console.log('updateValues', updateValues);

    // return;

    sdk.field
    .setValue(updateValues)
    .then((data) => {
      console.log('1', data); // Returns "foo".
    })
    .catch((err) => {
      console.log('2', err);
    })
  }

  // let viewable = null

  // const viewable = entries.map(item => {
  //   return (
  //     <Flex marginTop="spacingM" key={item.sys.id}>
  //       <Card style={{"width":"100%"}}>
  //         <Flex justifyContent="space-between">
  //           {/* <FormLabel>hiya</FormLabel> */}
  //           <FormLabel>{item.fields.title ? item.fields.title[locale] : 'Untitled'}</FormLabel>
  //           <CardActions position="left">
  //             <DropdownList>
  //               <DropdownListItem onClick={() => handleEditSelected(item.sys.id)}>Edit</DropdownListItem>
  //               <DropdownListItem onClick={() => handleRemoveSelected(item.sys.id)}>Remove</DropdownListItem>
  //             </DropdownList>
  //           </CardActions>
  //         </Flex>
  //         <Flex alignItems="flex-end" justifyContent="space-between">
  //           <TextField
  //             value={item.fields.slug ? `{{${item.fields.slug[locale]}}}` : 'undefined'}
  //             name="embed"
  //             id="embed"
  //             width="full"
  //             textInputProps={{
  //               disabled: true,
  //             }}
  //           />
  //           <CopyButton
  //             copyValue={item.fields.slug ? `{{${item.fields.slug[locale]}}}` : ''}
  //             style={{"marginLeft":"10px"}} />            
  //         </Flex>
  //       </Card>
  //     </Flex>
  //   )
  // })


  const handleAddExisting = () => {

    setDuplicateMessage(false)

    sdk.dialogs
      .selectSingleEntry({
        locale: 'en-US',
        contentTypes: 'dynamicContent'
      })
      .then((result) => {
        // console.log('result', result);

        if (!result) return

        const found = entries.find(item => {
          return item.sys.id === result.sys.id
        })

        if (!found) {
          // console.log('hit');
          setEntries(prevState => {
            return [
              ...prevState,
              result
            ]
          })
          // setDataValues()
        } else {
          setDuplicateMessage(true)
          console.log('already selected');
        }
      })
  }


  const handleEditSelected = id => {

    setDuplicateMessage(false)

    if (!id) return

    sdk.navigator
      .openEntry(
        id,
        { slideIn: { waitForClose: true } }
        // { slideIn: true }
      )
      .then((result) => {
        if (!result) return

        console.log('result', result.entity);
        // console.log('Edited', result.entity.sys.id);
        const index = entries.findIndex(item => {
          // console.log('item', item.sys.id);
          // return true
          return item.sys.id === result.entity.sys.id
        })
        // console.log('index', index);
        let tempArray = entries
        console.log('still result?', tempArray[index]);
        tempArray[index] = result.entity
        console.log('tempArray', tempArray);

        setEntries(tempArray)
        console.log('done');
        // setDataValues()

        setTimeout(() => { setDummy(!dummy) }, 2000);
        

        // setEntries(prevState => {
        //   return [
        //     ...prevState,
        //     result
        //   ]
        // })
      })
  }

  const handleRemoveSelected = id => {

    console.log('Removing...');

    console.log('entries before', entries);
    setDuplicateMessage(false)


    const workingEntries = [ ...entries ]
    console.log('working', workingEntries); 

    // return

    if (!id) return

    // console.log('result', result.entity);
      // console.log('Edited', result.entity.sys.id);
    const index = workingEntries.findIndex(item => {
      return item.sys.id === id
    })
    console.log('index', index);
    let tempArray = workingEntries

    if (index > -1) {
      tempArray.splice(index, 1);
    }

    // console.log('still result?', tempArray[index]);
    // tempArray[index] = result.entity
    console.log('tempArray', tempArray);

    setEntries(tempArray)
    // setEntries(prevState => {
    //   if (index > -1) {
    //     prevState.splice(index, 1);
    //   }
    //   console.log('prev', [ ...prevState]);
    //   return prevState
    // })

    // setDataValues()

  }


    //   const field = sdk.entry.fields.iterableObject
  //   field.setValue(data)


  const handleAddNew = () => {

    sdk.navigator
      .openNewEntry(
        'dynamicContent',
        { slideIn: { waitForClose: true } }
      )
      .then((result) => {
        console.log('result', result);
        if (!result) return

        setEntries(prevState => {
          return [
            ...prevState,
            result.entity
          ]
        })


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

  // console.log('isOpen', isOpen);


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

  const dummyClick = () => {
    setDummy(!dummy)
  }

  //#cf-ui-dropdown-list




  return (
    <div className="demo">
      <Flex
        // justifyContent="space-between"
        // alignItems="center"
      >
        <TextLink icon="Search" onClick={handleAddExisting}>Choose from exisiting</TextLink>
        <Paragraph style={{"marginLeft": "10px", "marginRight": "10px"}} onClick={dummyClick}>– or -</Paragraph>
        <TextLink icon="PlusCircle" onClick={handleAddNew}>Create new</TextLink>
      {/*           <Select width="auto"> */}
      {/*   <Option value="">Create new content</Option> */}
      {/*   <Option>Add snippet</Option> */}
      {/*   <Option>Add advertisement</Option> */}
      {/* </Select> */}
      </Flex>
      <Flex marginTop="spacingM" flexDirection="column">
        {duplicateMessage && <ValidationMessage>Cannot have duplicate choices.</ValidationMessage> }

        {entries.map(entry => {
          // console.log('item', item);

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
                  {/* <FormLabel>hiya</FormLabel> */}
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
                    opyValue={entry.fields.slug ? `{{${entry.fields.slug[locale]}}}` : ''}
                    style={{"marginLeft":"10px"}} />            
                </Flex>
              </Card>
            </Flex>
          )
        })}

      </Flex>
    </div>
  )
}

export default Demo