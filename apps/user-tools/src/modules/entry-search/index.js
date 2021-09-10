import { Typography, Heading } from '@contentful/forma-36-react-components'

import SelectContentType from './select-content-type'
import DisplayResults from './display-results'

const EntrySearch = ({ updateQuery }) => {
  
  return (
    <>
      <Typography>
        <Heading>Find Entries</Heading>
        <SelectContentType />
        <DisplayResults />
      </Typography>
    </>
  )  
}

export default EntrySearch