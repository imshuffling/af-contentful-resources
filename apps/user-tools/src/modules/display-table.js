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
  SectionHeading
} from '@contentful/forma-36-react-components'

import { ProductIcon } from '@contentful/forma-36-react-components/dist/alpha';

const DisplayTable = () => {

  return null

  const { sdk } = useContext(AppContext)

  const foobar = sdk.space.getContentTypes();
  foobar.then(res => {
    console.log('res', res);
  })

  return (
    <div className="app">
      <Workbench>
        <Workbench.Header
          title="User Tools"
          icon={<ProductIcon icon="Settings" color="positive" size="large" />}
        />
        <Workbench.Content type="default">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Organization role</TableCell>
                  <TableCell>Last activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Jane Roe</TableCell>
                  <TableCell>jane@roe.com</TableCell>
                  <TableCell>CEO</TableCell>
                  <TableCell>August 29, 2018</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john@doe.com</TableCell>
                  <TableCell>CTO</TableCell>
                  <TableCell>July 27, 2019</TableCell>
                </TableRow>
              </TableBody>
            </Table>
        </Workbench.Content>
        <Workbench.Sidebar position="right">
          <Typography>
            <SectionHeading>Title</SectionHeading>
            <Paragraph>paragraph</Paragraph>
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non ut
              accusamus quia debitis expedita consectetur!
            </Paragraph>
          </Typography>
        </Workbench.Sidebar>
      </Workbench>
    </div>
  )
 
}

export default App