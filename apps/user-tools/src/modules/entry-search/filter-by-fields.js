import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context';

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
  Spinner,
  Grid,
  GridItem,
  IconButton
} from '@contentful/forma-36-react-components'


const operations = {
  "Equals": "[is]",
  "Does Not Equal": "[ne]",
  "Contains": "[match]",
  "Includes": "[in]",
  "Excludes": "[nin]",
  "Greater Than": "[gt]",
  "Greater Than or Equal To": "[gte]",
  "Less Than": "[lt]",
  "Less Than or Equal To": "[lte]",
  "Exists": "[exists]",
  "Does Not Exist": "[!exists]"
}

const FilterByFields = () => {

  const { sdk, updateEntryQuery, entryQuery } = useContext(AppContext)

  const [filterCount, setFilterCount] = useState(0)

  const [fields, setFields] = useState([])
  const [field, setField] = useState()

  const [key, setKey] = useState()
  const [operator, setOperator] = useState()
  const [value, setValue] = useState()




  // Get Content types
  useEffect(() => {
    onSelectContentType()
    return () => {
      // console.log('cleanup');
      // Remove param from main query when exiting
      // handleRemoveQuery()
    }
  }, [entryQuery.content_type])


  useEffect(() => {
    // onSelectContentType()

    if (value) {
      handleAddQuery()
    }

    return () => {
      console.log('cleanup');
      // Remove param from main query when exiting
      handleRemoveQuery()
    }
  }, [value])

  // updateQuery
  const onSelectContentType = () => {
//     const id = event.target.value
// 
//     // Reset
//     if (!id) {
//       setContentType()
//       setFields([])
//     }

    if (!entryQuery.content_type) return

    const foobar = sdk.space.getContentType(entryQuery.content_type)
    foobar.then(res => {
      // setContentType(res)

      // Update main entry query
      // updateEntryQuery('content_type', res.sys.id)

      // Set fields
      if (res.fields && Array.isArray(res.fields)) {
        setFields(res.fields)
      }

    })
  }



  const onSelectField = event => {
    setKey(event.target.value)
    setField(fields.find(obj => obj.id === event.target.value))
  }


  const onSelectFieldTwo = event => {
    setOperator(event.target.value)
  }




  // Fields
  const generateFieldSelect = () => {
    return (
      // <GridItem>
        // <Flex>
        <div>
          <FormLabel>Field</FormLabel>
          <Select id="optionSelect" name="optionSelect" onChange={event => onSelectField(event)} width="full" value={key}>
            <Option value="">-- Select A Field --</Option>
            {fields.map(row => {
              return (
                <Option key={row.id} value={row.id}>{row.name}</Option>
              )
            })}
          </Select>
        </div>
        // </Flex>
      // </GridItem>
    )
  }

  

  // Operators
  const generateOperatorSelect = () => {
    const options = []
    for (const [key, value] of Object.entries(operations)) {
      options.push(<Option key={key} value={value}>{key}</Option>)
    }
    return (
      <div>
        <FormLabel>Condition</FormLabel>
        <Select width="full" value={operator} onChange={event => onSelectFieldTwo(event)}>
          <Option value="">-- Select A Condtion --</Option>
          {options}
        </Select>
      </div>
    )
  }


  const handleAddQuery = () => {
    updateEntryQuery(`${key}${operator}`, value)
  }

  const handleRemoveQuery = () => {
    updateEntryQuery(`${key}${operator}`, '', true)
  }



  const handleInputChange = event => {
    setValue(event.target.value)
  }

  const generateInput = () => {
    return (
      <div>
        <FormLabel>Value</FormLabel>
        <TextInput
          id="text-input"
          width="full"
          value={value}
          // onChange={(event) => setValue(event.target.value)}
          onChange={event => handleInputChange(event)}
        />
      </div>
    )
  }

  return (
    <>
      {/* <Flex justifyContent="space-between" marginBottom="spacingM"> */}
      
      <Grid columns={3} style={{ width: '100%' }}>
        

        
        {entryQuery.content_type && generateFieldSelect()}
        {field && generateOperatorSelect()}
        {/* {fields && fields.length > 0 && generateOperatorSelect()} */}
        {operator && generateInput()}                

        <div>
          <Button onClick={handleAddQuery}>Add</Button>&nbsp;&nbsp;&nbsp;
          <Button onClick={handleRemoveQuery}>Remove</Button>
        </div>

      </Grid>

      {/* <br /> */}
      {/* {entryQuery.content_type && <Button>Add Filter</Button>} */}
        
      {/* </Flex> */}
    </>
  )
  
}

export default FilterByFields