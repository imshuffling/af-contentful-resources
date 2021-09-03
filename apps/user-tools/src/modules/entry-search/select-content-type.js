import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context';
import { generateToken } from '../../library/utilities';
import FilterByFields from './filter-by-fields';

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
  IconButton
} from '@contentful/forma-36-react-components'

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

const SelectContentType = () => {

  const { sdk, updateEntryQuery, entryQuery } = useContext(AppContext)

  const [contentTypes, setContentTypes] = useState([])
  const [contentType, setContentType] = useState()

  const [fields, setFields] = useState([])
  const [displayField, setDisplayField] = useState()
  // const [contentType, setContentType] = useState([])

  const [filters, setFilters] = useState([])
  const [results, setResults] = useState()


  // Get Content types
  useEffect(() => {
    const foobar = sdk.space.getContentTypes();
    foobar.then(res => {
      if (res.items && Array.isArray(res.items)) {
        setContentTypes(res.items)
      }
    })
  }, [])


  // updateQuery
  const onSelectContentType = event => {
    const id = event.target.value

    console.log('id', id);

    // Reset
    if (!id) {
      setContentType()
      setFields([])
      return
    }

    const foobar = sdk.space.getContentType(id)
    foobar.then(res => {
      setContentType(res)

      // Update main entry query
      updateEntryQuery('content_type', res.sys.id)

      // Set fields
//       if (res.fields && Array.isArray(res.fields)) {
//         setFields(res.fields)
//       }
// 
//       // Set display field
//       if (res.displayField && res.displayField !== undefined) {
//         setDisplayField(res.displayField)
//       }
    })
  }


  const onSelectField = event => {
    const id = event.target.value


    // Reset
    if (!id) {
      setContentType()
      setFields([])
    }

    // updateEntryQuery('fields', { title: 'Compounding X-ray Profits: A Guide to Rollovers'} )

    // const query = {
    //   "content_type": contentType.sys.id,
    //   // "limit": 3,
    //   // ['sys.id']: '3cGnVZoSysTvOjKyoNkkIm'
    // }


    // const foobar = sdk.space.getEntries(query)
    // foobar.then(res => {
    //   if (res.items && Array.isArray(res.items)) {
    //     // setResults(res)
    //   }
    // })
  }


  const tempFindEntries = () => {


    const temp = {
      ...entryQuery,
      "fields.title[ne]": "Compounding X-ray Profits: A Guide to Rollovers,"
    } 
    

    
    const foobar = sdk.space.getEntries(temp)
    foobar.then(res => {
      if (res.items && Array.isArray(res.items)) {
        setResults(res)
      }
    })
  }









  const handleUpdateEntry = () => {

    for (const item of results.items) {

      item.fields.question['en-US'] = "Foobar WorkingXX?"

      const updateData = {
        "sys": {
          "id": item.sys.id,
          "version": item.sys.version
        },
        "fields": item.fields
      }


      const foobar = sdk.space.updateEntry(updateData)
      foobar
        .then(res => {
          // if (res.items && Array.isArray(res.items)) {
          //   setResults(res.items)
          // }

          const tempdata = {
            "sys": {
              "id": res.sys.id,
              "version": res.sys.version
            }
          }


          // Then publish
          const barfoo = sdk.space.publishEntry(tempdata)
          barfoo
            .then(res => {
            })
            .catch(err => {
            })

        })
        .catch(err => {
        })
    }
  }

  const resultItems = results && results.items ? results.items : []






  





  const contentTypeSelect = (
    <Flex>
      <Select
        id="optionSelect"
        width="large"
        name="optionSelect" onChange={(event) => onSelectContentType(event)}
      >
        <Option value="">-- Select A Content Type --</Option>
        {contentTypes.map(row => {
          return (
            <Option key={row.sys.id} value={row.sys.id}>{row.name}</Option>
          )
        })}
      </Select>
      <Button
        // onClick={handleAddFilter}
        // onClick={handleAddFilter}
        disabled={contentType ? false : true}
        className="f36-margin-left--l"
        // style={{ whiteSpace: 'no-wrap'}}

      >
        Find Entries
      </Button>
    </Flex>
  )


  const handleAddFilterX = () => {
    setFilters(prevState => {
      return (
        [ ...prevState, generateToken() ]
      )
    })
  }

  const handleAddFilter = () => {
    setFilters(prevState => {
      return (
        [ ...prevState, { [generateToken()]: <FilterByFields /> } ]
      )
    })
  }

  const handleRemoveFilterX = id => {
    setFilters(prevState => {

      const array = prevState.filter(item => item !== id)


      return (
        [ ...array ]
      )
    })
  }

  const handleRemoveFilter = id => {
    setFilters(prevState => {

      const array = prevState.filter(item => {
        const foobar = Object.keys(item)[0]
        console.log('foobar', foobar, id);
         return foobar !== id
        // if (foobar !== id) return
      })

      console.log('array1', array);

      return (
        [ ...array ]
      )
    })
  }












  const filtersDisplay = (
    <div className="filter-wrapper f36-margin-top--m">

      {filters.map(row => {
        const key = Object.keys(row)[0]
        const value = Object.values(row)[0]
        return (
          <Flex padding="spacingS" key={key}>
            {value}
            {/* <div className="f36-margin-left--l"> */}
            {/*   <FormLabel>Remove</FormLabel> */}
              <IconButton
                buttonType="muted"
                iconProps={{
                  icon: 'Delete',
                  size: 'small'
                }}
                onClick={() => handleRemoveFilter(key)}
                // disabled={field ? false : true}
                style={{
                  marginTop: '24px',
                  marginLeft: '10px'
                }}
            />
            {/* </div> */}
          </Flex>
        )
      })}

    </div>
  )



  return (
    <>
      <div>
        
        {contentTypeSelect}
        {filters.length > 0 && filtersDisplay}

        <Button
          // onClick={handleAddFilter}
          onClick={handleAddFilter}
          disabled={contentType ? false : true}
          buttonType="muted"
          className="f36-margin-top--m"

        >
          Add Search Filter
        </Button>

        



      </div>





      

    </>
  )
  
}

export default SelectContentType