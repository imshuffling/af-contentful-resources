import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context'

import {
  Select,
  Option,
  TextInput,
  FormLabel,
  Grid,
  ValidationMessage,
  Tooltip,
  Icon,
  Button
} from '@contentful/forma-36-react-components'

const operations = {
  "All [all]": "[all]",
  "Equals [e]": "[e]",
  "Does Not Equal [ne]": "[ne]",
  "Contains [match]": "[match]",
  "Includes [in]": "[in]",
  "Excludes [nin]": "[nin]",
  "Greater Than [gt]": "[gt]",
  "Greater Than or Equal To [gte]": "[gte]",
  "Less Than [lt]": "[lt]",
  "Less Than or Equal To [lte]": "[lte]",
  "Exists [exists]": "[exists]"
}

// TODO: all

const textOperations = {
  "Equals [e]": "[e]",
  "Does Not Equal [ne]": "[ne]",
  "Contains [match]": "[match]",
  "Exists [exists]": "[exists]"
}

const numericOperators = {
  "Equals [e]": "[e]",
  "Greater Than [gt]": "[gt]",
  "Greater Than or Equal To [gte]": "[gte]",
  "Less Than [lt]": "[lt]",
  "Less Than or Equal To [lte]": "[lte]",
  "Exists [exists]": "[exists]"
}

const booleanOperators = {
  "Equals [e]": "[e]",
  "Exists [exists]": "[exists]"
}

const objectOperators = {
  "Exists [exists]": "[exists]"
}

const linkOperators = {
  "All Values [all]": "[all]",
  "Equals [e]": "[e]",
  "Does Not Equal [ne]": "[ne]",
  "Includes [in]": "[in]",
  "Excludes [nin]": "[nin]",
  "Exists [exists]": "[exists]"
}

const arrayOperators = {
  "All [all] array": "[all]",
  "Equals [e]": "[e]",
  "Does Not Equal [ne]": "[ne]",
  "Includes [in]": "[in]",
  "Excludes [nin]": "[nin]",
  "Exists [exists]": "[exists]"
}

const operationsTwo = [
  {
    "type": "Symbol",
    "options": textOperations
  },
  {
    "type": "Text",
    "options": textOperations
  },
  {
    "type": "Date",
    "options": numericOperators
  },
  {
    "type": "Integer",
    "options": numericOperators
  },
  {
    "type": "Boolean",
    "options": booleanOperators
  },
  {
    "type": "Object",
    "options": objectOperators
  },
  {
    "type": "Link",
    "options": linkOperators
  },
  {
    "type": "Array",
    "options": arrayOperators
  }
]

const excludedOperators = ['[e]']










const FilterByFields = () => {

  // Grab app context
  const { sdk, updateEntryQuery, entryQuery } = useContext(AppContext)

  // Set state for this module
  const [fields, setFields] = useState([])
  const [field, setField] = useState()
  const [key, setKey] = useState('')
  const [operator, setOperator] = useState('')
  const [value, setValue] = useState('')

  // console.log(fields);
  // for (const row of fields) if (row.type === 'Array') console.log(`id: ${row.id}, type: ${row.items.type}, linkType: ${row.items.linkType}`);

  /**
   * Grab fields from content type when created
   * @return {null}
   */
  useEffect(() => {
    getContentTypeFields()
  }, [])

  /**
   * Update query with value using timeout
   * Remove param from main query when dropped
   * @return {null}
   */
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (operator || value) {
        handleAddQuery()
      }
    }, 500)
    return () => {
      handleRemoveQuery()
      clearTimeout(timeout)
    }
  }, [operator, value])

  /**
   * Query SDK to generate list of filterable fields
   * @return {null}
   */
  const getContentTypeFields = () => {
    if (!entryQuery.content_type) return
    const response = sdk.space.getContentType(entryQuery.content_type)
    response.then(res => {
      if (res.fields && Array.isArray(res.fields)) {
        res.fields.sort((a, b) => {
            const textA = a.name.toUpperCase()
            const textB = b.name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
        setFields(res.fields)
      }
    })
  }

  /**
   * Update key and reset filter when selecting new field
   * @param  {obj} event
   * @return {null}
   */
  const handleFieldSelect = event => {
    handleRemoveQuery()

    const foobar = fields.filter(item => item.id === event.target.value)
    setField(foobar[0])

    setKey(event.target.value)
    setOperator('')
    setValue('')
  }

  /**
   * Update operator and reset value when selecting new operator
   * @param  {obj} event
   * @return {null}
   */
  const handleOperatorSelect = event => {
    setOperator(event.target.value)
  }

  /**
   * Update input value
   * @param  {obj} event
   * @return {null}
   */
  const handleInputChange = event => {
    setValue(event.target.value)
  }

  /**
   * Push valid filter query up to app context
   * @return {null}
   */
  const handleAddQuery = () => {
    
    if (key && operator && value) {
      const operatorValue = excludedOperators.includes(operator) ? '' : operator
      updateEntryQuery(`fields.${key}${operatorValue}`, value)
    }
  }

  /**
   * Remove filter query from app context
   * @return {null}
   */
  const handleRemoveQuery = () => {
    if (key && operator) {
      const operatorValue = excludedOperators.includes(operator) ? '' : operator
      updateEntryQuery(`fields.${key}${operatorValue}`, '', true)
    }
  }

  // TODO
  const handleAddLink = () => {
    // console.log('field', field.items.validations.linkContentType);
    let contentTypes
    const validations = field.items.validations
    console.log('validations', validations);
    const response = sdk.dialogs.selectSingleEntry({ "contentTypes": ["article"] })
    response.then(res => {
      console.log('adlink', res);      
    })
  }

  /**
   * Build the dropdown of fields
   * @return {str}
   */
  const generateFieldSelect = () => {
    return (
      <div>
        <FormLabel>Field</FormLabel>
        <Select id="optionSelect" name="optionSelect" onChange={event => handleFieldSelect(event)} width="full" value={key}>
          <Option value="">-- Select A Field --</Option>
          {fields.map(row => {
            return (
              <Option key={row.id} value={row.id}>{row.name}</Option>
            )
          })}
        </Select>
      </div>
    )
  }  

  /**
   * Build the dropdown of operators conditionally based on field type
   * @return {str}
   */
  const generateOperatorSelect = () => {
    
    // TODO
    const foobar = operationsTwo.filter(item => item.type === field.type)[0]
    // setField(foobar[0])
    // console.log('foobar', foobar);

    if (!foobar) return <ValidationMessage>Options missing.</ValidationMessage>

    const options = []
    for (const [key, value] of Object.entries(foobar.options)) {
      options.push(<Option key={key} value={value}>{key}</Option>)
    }
    return (
      <div>
        <FormLabel>Condition</FormLabel>
        <Select width="full" value={operator} onChange={event => handleOperatorSelect(event)}>
          <Option value="">-- Select A Condition --</Option>
          {options}
        </Select>
      </div>
    )
  }

  /**
   * Build a value input based on field type
   * @return {str}
   */
  const generateValueInput = () => {

    const inputTypes = ['Symbol', 'Text', 'Date', 'Integer']


    switch (true) {

      case field.type === 'Boolean' || operator === '[exists]':
        return (
          <div>
            <FormLabel>Value</FormLabel>
            <Select width="full" value={operator} onChange={event => handleInputChange(event)}>
              <Option value="">-- Select An Option --</Option>
              <Option value="true">True</Option>
              <Option value="false">False</Option>
            </Select>
          </div>
        )
        break


      case inputTypes.includes(field.type):

        // Set input type
        let type
        switch (field.type) {
          case 'Date':
            type = 'date'
            break
          case 'Integer':
            type = 'number'
            break
          default:
            type = 'text'
            break
        }

        return (
          <div>
            <FormLabel>Value</FormLabel>
            <TextInput
              width="full"
              type={type}
              value={value}
              onChange={event => handleInputChange(event)}
            />
          </div>
        )
        break

      // Array of multiple checkboxes
      case field.type === 'Array' && field.items.type === 'Symbol':
        return (
            <div>
              <FormLabel>Value
                <Tooltip content="For multiple values, use comma separated list without spaces.">
                  <Icon
                    color="muted"
                    icon="HelpCircle"
                    size="tiny"
                    className="f36-margin-left--xs"
                    style={{ "verticalAlign": "middle" }}
                  />
                </Tooltip>
              </FormLabel>
              <TextInput
                width="full"
                type="text"
                value={value}
                onChange={event => handleInputChange(event)}
              />
          </div>
          )
          break

        // Array of multiple checkboxes
        case field.type === 'Array':
        return (
            <div>
              <FormLabel>Value</FormLabel>
              <Button
                onClick={handleAddLink}
                type="muted"
              >
                Add Entry
              </Button>
          </div>
          )
          break




      default:
        return <ValidationMessage>Invalid field type.</ValidationMessage>
        break;
    }

    console.log('end');
    
  }

  return (      
    <Grid columns={3} style={{ width: '100%' }}>
      {entryQuery.content_type && generateFieldSelect()}
      {key && generateOperatorSelect()}
      {operator && generateValueInput()}                
    </Grid>
  )
  
}

export default FilterByFields