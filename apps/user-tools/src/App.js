import { useState, useEffect, useContext } from 'react'
import { AppContext } from './context';

import { Workbench, Typography } from '@contentful/forma-36-react-components'
import { ProductIcon } from '@contentful/forma-36-react-components/dist/alpha'

import EntrySearch from './modules/entry-search'

import '@contentful/forma-36-fcss/dist/styles.css'

const App = () => {
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
      </Workbench>
    </div>
  )
 
}

export default App