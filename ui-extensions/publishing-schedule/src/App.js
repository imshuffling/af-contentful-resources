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
  HelpText,
  SelectField,
  Option,
  CheckboxField,
  Grid,
  Textarea


} from '@contentful/forma-36-react-components'

// Start and starting vars
const weekdays = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const calendar = Array.from(Array(31).keys())
const initialState = {
  'description': '',
  'frequency': 'weekly',
  'manual': [],
  'days': [],
  'overrides': []
}

const App = ({ sdk }) => {

  // Data config, check for old data first 
  const initialData = sdk.field.getValue();
  const [data, setData] = useState(initialData ? initialData : initialState);

//   useEffect(() => {
//     const temp = data.days.filter(item => item !== "0")
//     console.log('temp', temp);
// 
//     setData(prevState => {
//       // let days =  prevState.days
//       const newState = { ...prevState }
//       // if (days.includes(value.toString())) {
//       //   days = days.filter(item => item !== value)
//       // } else {
//       //   days = [ ...days, value ]
//       // }
//       newState.days = temp
//       return newState
//     })
// 
//   }, [])

  /**
   * Update SDK/data on input change
   */
  useEffect(() => {
    handleUpdateField()
  }, [data])

  /**
   * Set up field to update value
   */
  const handleUpdateField = () => {
    sdk.field
      .setValue(data)
      .then((result) => {})
      .catch((error) => {
        console.log('Error', error);
      })
  }

  /**
   * Handle updating state when selecting frequency type
   * @param  {obj} event
   * @return {null}
   */
  const handleDescriptionInput = (event) => {
    const value = event.target.value
    setData(prevState => {
      const newState = { ...prevState }
      newState.description = value
      return newState
    })
  }

  /**
   * Handle updating state when selecting frequency type
   * @param  {obj} event
   * @return {null}
   */
  const handleSelectFrequency = (event) => {
    const value = event.target.value
    setData(prevState => {
      const newState = { ...prevState }
      newState.frequency = value
      return newState
    })
  }

  /**
   * Handle updating state when checking multiple days
   * @param  {obj} event
   * @return {null}
   */
  const handleCheckDay = (event) => {
    const value = event.target.value
    setData(prevState => {
      let days =  prevState.days
      const newState = { ...prevState }
      if (days.includes(value.toString())) {
        days = days.filter(item => item !== value)
      } else {
        days = [ ...days, value ]
      }
      days.sort((a,b) => a - b)
      newState.days = [...new Set(days)]
      return newState
    })

  }

  /**
   * Handle updating state when override field is updated
   * @param  {obj} event
   * @return {null}
   */
  const handleTextareaOverrides = (event) => {
    const value = event.target.value
    const array = getDatesFromString(value, false)
    const newArray = []
    for (const row of array) {

      // Look for pipe to split dates
      if (row.includes('|')) {
        const dates = row.split('|')

        // We only care about the first two splits, all else is considered error
        if (dates.length > 1 && validateDate(dates[0]) && validateDate(dates[1])) {
          newArray.push({
            original: dates[0],
            replacement: dates[1]
          })
        }

      } 
    }
    setData(prevState => {
      const newState = { ...prevState }
      newState.overrides = newArray
      return newState
    })
  }

  /**
   * Handle updating state when manual publishing schedule field is updated
   * @param  {obj} event
   * @return {null}
   */
  const handleTextareaManual = (event) => {
    const value = event.target.value
    const array = getDatesFromString(value)
    setData(prevState => {
      const newState = { ...prevState }
      newState.manual = array
      return newState
    })
  }

    /**
   * Build array of valid dates base of supplied string
   * Break down comma separated list or line breaks
   * @param  {str} string
   * @param  {bool} validate
   * @return {arr}
   */
  const getDatesFromString = (string, validate = true) => {

    // Remove whitespaces
    if (string.includes(' ')) string.replace(' ', '')

    // Set flags based on string
    const hasCommas = string.includes(',')
    const hasBreaks = string.includes("\n")
    let array = []

    // Build array based on data provided
    switch (true) {
      case hasCommas && hasBreaks:
        const firstStep = string.split("\n")
        let newArray = []
        for (const row of firstStep) {
          if (row.includes(',')) {
            newArray = newArray.concat(row.split(','));
          } else {
            newArray.push(row)
          }
        }
        array = newArray
        break
      
      case hasCommas:
        array = string.split(',')
        break

      case hasBreaks:
        array = string.split("\n")
        break

      default:
        array = [string]
        break
    }

    // Check to validate before returning
    if (validate) {
      return array.filter(item => validateDate(item))
    } else {
      return array
    }
  } 

  /**
   * Validate string for date format
   * MM/DD/YYYY, DD/MM/YYYY
   * @param  {str} string
   * @return {bool}
   */
  const validateDate = string => {
    // const regex = /^([0-2][0-9]|(3)[0-1]|[1-9])(\/)(((0)[0-9])|((1)[0-2]|[1-9]))(\/)\d{4}$/
    const regex = /^([0-2][0-9]|(3)[0-1]|[1-9])(\/)(((0)[0-9])|((1)[0-2])|[0-2][0-9]|[1-9])(\/)\d{4}$/i
    return regex.test(string)
  }

  /**
   * Build weekday selector
   */
  const checkWeekdays = (
    <Flex marginTop="spacingXs" justifyContent="space-between">
      {weekdays.map((day, index) => {
        const value = index + 1
        return (
          <CheckboxField
            key={value}
            value={value}
            id={`week${value}`}
            name="days"
            labelText={day}
            onChange={(event) => handleCheckDay(event)}
            checked={data.days.includes(value.toString())}
          />
        )
      })}
    </Flex>
  )

  /**
   * Build calendar day grid selector
   */
  const checkDays = (
    <Grid
      columnGap="spacingXs"
      rowGap="spacingXs"
      columns={7}
      className="f36-margin-top--s"
    >
      {calendar.map((day, index) => {
        const value = index + 1
        return (
          <CheckboxField
            key={value}
            value={value}
            id={`month${value}`}
            name="days"
            labelText={day + 1}
            onChange={(event) => handleCheckDay(event)}
            checked={data.days.includes(value.toString()) ? true : false}
          />
        )
      })}
    </Grid>
  )

  /**
   * Build overrides textarea
   */
  const overrides = () => {

    // Build initial values
    let value = ''
    for (let i = 0, len = data.overrides.length; i < len; i++) {
      value += `${data.overrides[i].original}|${data.overrides[i].replacement}`
      if (i + 1 < len) value += `\n`
    }

    return (
      <div className="f36-margin-top--m">
        <FormLabel>Date Overrides</FormLabel>
        <HelpText>
          Enter list of overriding dates with original and replacement dates by with a pipe ("|").<br />
          Comma separated or with line breaks. Omitting the year will set the override to occur every year.<br />
          <em>Format: DD/MM/YYYY|DD/MM/YYYY</em>
        </HelpText>
        <Textarea
          name="overrides"
          rows={3}
          placeholder="Examples (Specific): 09/06/2021|9/7/2021  - or -  (Annually): 12/25|12/26"
          onChange={(event) => handleTextareaOverrides(event)}
          defaultValue={value}
          className="f36-margin-top--xs"
        />
      </div>
    )
  }

  /**
   * Build manual list textarea
   */
  const manualList = () => {

    // Build initial values
    let value = ''
    for (let i = 0, len = data.manual.length; i < len; i++) {
      value += `${data.manual[i]}`
      if (i + 1 < len) value += `\n`
    }

    return (
      <div className="f36-margin-top--m">
        <FormLabel>Manually Enter Dates</FormLabel>
        <HelpText>
          Enter a list of publishing dates, comma separated or with line breaks. <em>Format: DD/MM/YYYY</em>
        </HelpText>
        <Textarea
          name="manual"
          rows={6}
          onChange={(event) => handleTextareaManual(event)}
          defaultValue={value}
          className="f36-margin-top--xs"
        />
      </div>
    )
  }
  
  return (
    <div className="app">
      <TextField
        name="description"
        labelText="Description"
        onChange={(event) => handleDescriptionInput(event)}
        value={data.description}
      />
      <Flex marginTop="spacingM">
        <SelectField
          name="frequency"
          labelText="Set Frequency"
          selectProps={{"width":"full"}}
          value={data.frequency}
          onChange={(event) => handleSelectFrequency(event)}
          style={{ width: '100%' }}
        >
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="manually">Manually</Option>
        </SelectField>
      </Flex>
      {data.frequency === 'weekly' && checkWeekdays}
      {data.frequency === 'monthly' && checkDays}
      {data.frequency !== 'manually' && overrides()}
      {data.frequency === 'manually' && manualList()}
    </div>
  )

}

export default App