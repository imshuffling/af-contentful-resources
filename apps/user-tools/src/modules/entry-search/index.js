import { useState } from 'react'
import {
  Typography,
  Heading,
  Subheading
} from '@contentful/forma-36-react-components'

import SelectContentType from './select-content-type'
// import FilterByFields from './filter-by-fields'
import DisplayResults from './display-results'

const EntrySearch = ({ updateQuery }) => {
  
  return (
    <>
      <Typography>
        <Heading>Find Entries</Heading>
        <SelectContentType />
        {/* <FilterByFields /> */}
        <DisplayResults />
      </Typography>
    </>
  )  
}

export default EntrySearch