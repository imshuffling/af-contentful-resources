import { useState, useEffect } from 'react'
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
  Button
} from '@contentful/forma-36-react-components'

import { ProductIcon } from '@contentful/forma-36-react-components/dist/alpha';


const operations = [
  'Includes',
  'Excludes',
  'Equals',
  'Greater Than',
  'Greater Than or Equal To',
  'Less Than',
  'Less Than or Equal To',
  'Exists'
]

const ContentTypesSelect = ({ sdk, updateQuery }) => {

  // console.log('sdk', sdk.space);

  const [contentTypes, setContentTypes] = useState([])
  const [contentType, setContentType] = useState()

  const [fields, setFields] = useState([])
  const [displayField, setDisplayField] = useState()
  // const [contentType, setContentType] = useState([])

  const [results, setResults] = useState()

  useEffect(() => {
    const foobar = sdk.space.getContentTypes();
    foobar.then(res => {
      if (res.items && Array.isArray(res.items)) {
        setContentTypes(res.items)
      }
    })
  }, [])



  const onSelectContentType = event => {
    const id = event.target.value

    // Reset
    if (!id) {
      setContentType()
      setFields([])
    }

    const foobar = sdk.space.getContentType(id)
    foobar.then(res => {
      setContentType(res)
      if (res.fields && Array.isArray(res.fields)) {
        setFields(res.fields)
      }
      if (res.displayField && res.displayField !== undefined) {
        setDisplayField(res.displayField)
      }
    })
  }


  const onSelectField = event => {
    const id = event.target.value

    // console.log('field', id);

    // Reset
    if (!id) {
      setContentType()
      setFields([])
    }

    const query = {
      "content_type": contentType.sys.id,
      // "limit": 3,
      // ['sys.id']: '3cGnVZoSysTvOjKyoNkkIm'
    }

    // console.log('query', query);

    const foobar = sdk.space.getEntries(query)
    foobar.then(res => {
      if (res.items && Array.isArray(res.items)) {
        setResults(res)
      }
    })
  }



  const handleUpdateEntry = () => {
    // console.log('clicked, results', results);

    for (const item of results.items) {

      item.fields.question['en-US'] = "Foobar WorkingXX?"

      const updateData = {
        "sys": {
          "id": item.sys.id,
          "version": item.sys.version
        },
        "fields": item.fields
      }

      // console.log('item.fields.question', item.fields.question['en-US']);
      // console.log('updateData', updateData);

      const foobar = sdk.space.updateEntry(updateData)
      foobar
        .then(res => {
          // console.log('res', res);
          // if (res.items && Array.isArray(res.items)) {
          //   setResults(res.items)
          // }

          const tempdata = {
            "sys": {
              "id": res.sys.id,
              "version": res.sys.version
            }
          }

          // console.log('tempdata', tempdata);

          // Then publish
          const barfoo = sdk.space.publishEntry(tempdata)
          barfoo
            .then(res => {
              // console.log('res2', res);
            })
            .catch(err => {
              // console.log('err2', err);
            })

        })
        .catch(err => {
          // console.log('err', err);
        })
    }
  }

  const resultItems = results && results.items ? results.items : []
  console.log('results', results);

  return (
    <>
      <Select id="optionSelect" name="optionSelect" onChange={(event) => onSelectContentType(event)}>
        <Option value="">-- Select A Content Type --</Option>
        {contentTypes.map(row => {
          // console.log('row', row);
          return (
            <Option key={row.sys.id} value={row.sys.id}>{row.name}</Option>
          )
        })}
      </Select>

      <br />

      {contentType && <FormLabel>Filter By Fields</FormLabel>}

      <Flex justifyContent="space-between" marginBottom="spacingM">
        <Select id="optionSelect" name="optionSelect" onChange={(event) => onSelectField(event)} width="auto">
          <Option value="">-- Select A Field --</Option>
          {fields.map(row => {
            // console.log('row', row);
            return (
              <Option key={row.id} value={row.id}>{row.name}</Option>
            )
          })}
        </Select>
        <Select width="auto">
          {operations.map((value, index) => {
            // console.log('option', option);
            return (
              <Option key={index} value={index}>{value}</Option>
            )
          })}
        </Select>
        <TextInput
          id="text-input"
          width="medium"
        />
        <TextInput
          type="number"
          id="text-input"
          width="medium"
          min="1"
          max="1000"
        />
        <TextInput
          type="date"
          id="text-input"
          width="medium"
        />
      </Flex>



      {fields.map(row => {
        return null
        // console.log('row', row);
        return (
          <Flex justifyContent="space-between" marginBottom="spacingM">
            <Paragraph key={row.id}>{row.id} - {row.type}</Paragraph>
            <Select width="small">
              {operations.map((value, index) => {
                // console.log('option', option);
                return (
                  <Option key={index} value={index}>{value}</Option>
                )
              })}
            </Select>
            <TextInput
              id="text-input"
              width="small"
            />
          </Flex>
        )
      })}

      {results && <Paragraph>Results Found: {results.total}</Paragraph>}

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
                <TableCell>{row.fields[displayField]['en-US']}</TableCell>
                <TableCell>{row.sys.id}</TableCell>
                <TableCell>{row.sys.version}</TableCell>
                <TableCell>{formatDate(row.sys.createdAt, 'M j, Y, g:i a')}</TableCell>
                <TableCell>{formatDate(row.sys.updatedAt, 'M j, Y, g:i a')}</TableCell>
              </TableRow>
            )
          })}


        </TableBody>
      </Table>

      <Button>Find Entries</Button>

    </>
  )
  
}

export default ContentTypesSelect


























/**
 * Return a format a date string, similar to PHP date()
 * Modified from: https://gist.github.com/micah1701/4120120 * 
 * @param  {obj|string|int} date
 * @param  {str} format
 * @return {str}
 */
export const formatDate = (date, format = 'Y-m-d H:i:s') => {
  
  if (!date || date === '') {
    date = new Date()
  } else if (typeof('date') !== 'object') {
    date = new Date(date) // attempt to convert string to date object  
  }

  // format = !format || format === '' ? 'Y-m-d H:i:s' : format
  
  let string = '',
    mo = date.getMonth(),   // month (0-11)
    m1 = mo+1,              // month (1-12)
    dow = date.getDay(),    // day of week (0-6)
    d = date.getDate(),     // day of the month (1-31)
    y = date.getFullYear(), // 1999 or 2003
    h = date.getHours(),    // hour (0-23)
    mi = date.getMinutes(), // minute (0-59)
    s = date.getSeconds(),  // seconds (0-59)
    months,
    days,
    hour
  
  for (let i = 0, len = format.length; i < len; i++) {
    switch(format[i]) {

      case 'j': // Day of the month without leading zeros  (1 to 31)
        string += d
        break

      case 'S': // English ordinal suffix for the day of the month, 2 characters (st, nd, rd or th.)
        string += (d % 10 === 1 && d !== 11 ? 'st' : (d % 10 === 2 && d !== 12 ? 'nd' : (d % 10 === 3 && d !== 13 ? 'rd' : 'th')))
        break
      
      case 'd': // Day of the month, 2 digits with leading zeros (01 to 31)
        string += (d < 10) ? '0'+d : d
        break
      
      case 'l': // (lowercase 'L') A full textual representation of the day of the week
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        string += days[dow]
        break
        
      case 'w': // Numeric representation of the day of the week (0=Sunday,1=Monday,...6=Saturday)
        string += dow
        break
        
      case 'D': // A textual representation of a day, three letters
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat']
        string += days[dow]
        break  
      
      case 'm': // Numeric representation of a month, with leading zeros (01 to 12)
        string += (m1 < 10) ? '0'+m1 : m1
        break  
    
      case 'n': // Numeric representation of a month, without leading zeros (1 to 12)
        string += m1
        break
      
      case 'F': // A full textual representation of a month, such as January or March 
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        string += months[mo]
        break
        
      case 'M': // A short textual representation of a month, three letters (Jan - Dec)
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        string += months[mo]
        break
          
      case 'Y': // A full numeric representation of a year, 4 digits (1999 OR 2003) 
        string += y
        break
        
      case 'y': // A two digit representation of a year (99 OR 03)
        string += y.toString().slice(-2)
        break
        
      case 'H': // 24-hour format of an hour with leading zeros (00 to 23)
        string += (h < 10) ? '0'+h : h
        break
      
      case 'g': // 12-hour format of an hour without leading zeros (1 to 12)
        hour = (h===0) ? 12 : h
        string += (hour > 12) ? hour -12 : hour
        break
        
      case 'h': // 12-hour format of an hour with leading zeros (01 to 12)
        hour = (h===0) ? 12 : h
        hour = ( hour > 12) ? hour -12 : hour
        string += (hour < 10) ? '0'+hour : hour
        break
      
      case 'a': // Lowercase Ante meridiem and Post meridiem (am or pm)
        string += (h < 12) ? 'am' : 'pm'
        break    
      
      case 'i': // Minutes with leading zeros (00 to 59)
        string += (mi < 10) ? '0'+mi : mi
        break
      
      case 's': // Seconds, with leading zeros (00 to 59)
        string += (s < 10) ? '0'+s : s
        break
        
      case 'c': // ISO 8601 date (eg: 2012-11-20T18:05:54.944Z)
        string += date.toISOString()
        break    
        
      default:
        string += format[i]
    }
  }

  return string

}