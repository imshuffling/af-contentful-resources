import { useState, useEffect, useContext } from 'react'
import { AppContext } from './context';
import {
  Workbench,
  Icon,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  DisplayText,
  Paragraph,
  FormLabel,
  Heading,
  Subheading,
  SectionHeading
} from '@contentful/forma-36-react-components'
import { ProductIcon } from '@contentful/forma-36-react-components/dist/alpha'

import ContentTypesSelect from './modules/content-types-select'
import EntrySearch from './modules/entry-search'

import '@contentful/forma-36-fcss/dist/styles.css'


// const initialQuery = {
//   "query": {
//     "content_type": null,
//     "limit": 4,
//     "fields": []
//   },
//   "change": {
//     "fields": []
//   }
// }

const initialQuery = {
  "content_type": null,
  "limit": 4,
  "fields": []
}

const initialUpdate = {
  "fields": []
}


const App = () => {

  const [query, setQuery] = useState(initialQuery)
  // console.log('query', query);

  /**
   * TODO
   */
  const updateQuery = (key, value) => {
    setQuery( prevState => {
      return {
        ...prevState,
        [key]: value
       }
    })
  }




  return (
    <div className="app">
      <Workbench>
        <Workbench.Header
          title="User Tools"
          icon={<ProductIcon icon="Settings" color="positive" size="large" />}
        />
        <Workbench.Content type="default">
          <Typography>
            <EntrySearch />
          </Typography>
        </Workbench.Content>
        {/* <Workbench.Sidebar position="right"> */}
        {/*   <Typography> */}
        {/*     <Paragraph>Something can go here...</Paragraph> */}
        {/*   </Typography> */}
        {/* </Workbench.Sidebar> */}
      </Workbench>
    </div>
  )
 
}

export default App