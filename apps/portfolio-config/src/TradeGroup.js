import { useState, useEffect } from 'react'
import {
  Switch,
  TextField,
  Flex,
  FormLabel,
  ValidationMessage,
  Button,
  Paragraph,
  Select,
  Option,
  Accordion,
  AccordionItem,
  CopyButton,
  Subheading,
  Icon
} from '@contentful/forma-36-react-components'

import Config from './Config'

const TradeGroup = ({ group, positionKeys, subtradeKeys }) => {

  /**
   * Set state/constants
   */
  const margin = 'spacingM'
  const title = group.config.tradeGroupId > 0 ? group.config.portfolioHeader : 'Ungrouped'
  const [showOptions, setShowOptions] = useState(false)


//   const [includeCustomColumns, setIncludeCustomColumns] = useState(false)
//   const [includeSubtrades, setIncludeSubtrades] = useState(false)
//   const [includeCustomSubtradeColumns, setIncludeCustomSubtradeColumns] = useState(false)
//   const [includeLinks, setIncludeLinks] = useState(true)
// 
// 
// 
//   const positionKeySelect = (
//     <Select id="primaryKey" name="primaryKey">
//       {positionKeys.map(element => {
//         return (
//           <Option value={element}>{element}</Option>
//         )
//       })}
//     </Select>
//   )
// 
//   const subtradeKeySelect = (
//     <Select id="subtradeKey" name="subtradeKey">
//       {subtradeKeys.map(element => {
//         return (
//           <Option value={element}>{element}</Option>
//         )
//       })}
//     </Select>
//   )
// 
//   const configOptions = (
//     <>
//       <Switch
//         labelText='Include Custom Columns?'
//         isChecked={includeCustomColumns}
//         onToggle={setIncludeCustomColumns}
//       />
//       <Flex marginTop={margin}>
//         {includeCustomColumns && positionKeySelect}
//         {includeCustomColumns && subtradeKeySelect}
//       </Flex>
//     </>
//   )


  return (
    <div className="trade-group">
      <Subheading
        className="trade-group-heading"
        onClick={() => setShowOptions(!showOptions)}
        style={{ display: 'flex' }}
      >
        {title}
        {/* <Icon */}
        {/*   icon={showOptions ? "ArrowDown" : "ArrowUp"} */}
        {/*   size="large" */}
        {/* /> */}
        <Switch
          labelText="Use Custom Config"
          isChecked={showOptions}
          onToggle={setShowOptions}
        />
      </Subheading>
        {showOptions && <Config positionKeys={positionKeys} subtradeKeys={subtradeKeys} />}
    </div>
  )
}

export default TradeGroup

// <Flex>
//   <Flex>
//     <Switch
//       labelText='Include Custom Columns?'
//       isChecked={includeCustomColumns}
//       onToggle={setIncludeCustomColumns}
//     />
//   </Flex>
//   <Flex marginLeft={margin}>
//     <Switch
//       labelText='Include Subtrades?'
//       isChecked={includeSubtrades}
//       onToggle={setIncludeSubtrades}
//     />
//   </Flex>
//   <Flex marginLeft={margin}>
//     <Switch
//       labelText='Include Custom Subtrade Columns?'
//       isChecked={includeCustomSubtradeColumns}
//       onToggle={setIncludeCustomSubtradeColumns}
//     />
//   </Flex>
//   <Flex marginLeft={margin}>
//     <Switch
//       labelText='Include Links?'
//       isChecked={includeLinks}
//       onToggle={setIncludeLinks}
//     />
//   </Flex>
// </Flex>