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
  Icon,
  CheckboxField
} from '@contentful/forma-36-react-components'

const Config = ({ positionKeys, subtradeKeys  }) => {

  /**
   * Set state/constants
   */
  const margin = 'spacingM'
  const marginClass = 'f36-margin-top--xs'
  const marginClass2 = 'f36-margin-left--s'
  // const title = group.config.tradeGroupId > 0 ? group.config.portfolioHeader : 'Ungrouped'
  // const [showOptions, setShowOptions] = useState(false)
  const [showCustomColumns, setShowCustomColumns] = useState(false)
  const [showCustomSubtradeColumns, setShowCustomSubtradeColumns] = useState(false)


  const [useCustomConfig, setUseCustomConfig] = useState(false)
  const [includeCustomColumns, setIncludeCustomColumns] = useState(false)
  const [includeSubtrades, setIncludeSubtrades] = useState(false)
  const [includeCustomSubtradeColumns, setIncludeCustomSubtradeColumns] = useState(false)
  const [includeLinks, setIncludeLinks] = useState(true)


  const positionKeySelect = (
    <Select id="primaryKey" name="primaryKey">
      {positionKeys.map(element => {
        return (
          <Option value={element}>{element}</Option>
        )
      })}
    </Select>
  )

  const subtradeKeySelect = (
    <Select id="subtradeKey" name="subtradeKey">
      {subtradeKeys.map(element => {
        return (
          <Option value={element}>{element}</Option>
        )
      })}
    </Select>
  )

  const configOptions = (
    <>
      <Flex justifyContent="space-between">
        <CheckboxField
          labelText="Include Links"
          id="includeLinks"
          checked={includeLinks}
          value={true}
          onChange={() => setIncludeLinks(!includeLinks)}
        />
        <CheckboxField
          labelText="Custom Columns"
          id="includeCustomColumns"
          checked={includeCustomColumns}
          value={true}
          onChange={() => setIncludeCustomColumns(!includeCustomColumns)}
          className={marginClass2}
        />
        <CheckboxField
          labelText="Include Subtrades"
          id="includeSubtrades"
          checked={includeSubtrades}
          value={true}
          onChange={() => setIncludeSubtrades(!includeSubtrades)}
          className={marginClass2}
        />
        <CheckboxField
          labelText="Custom Subtrade Columns"
          id="includeCustomSubtradeColumns"
          checked={includeCustomSubtradeColumns && includeSubtrades ? true : false}
          disabled={!includeSubtrades ? true : false}
          value={true}
          onChange={() => setIncludeCustomSubtradeColumns(!includeCustomSubtradeColumns)}
          className={marginClass2}
        />
      </Flex>
      {/* <Switch */}
      {/*   labelText="Include Links?" */}
      {/*   isChecked={includeLinks} */}
      {/*   onToggle={setIncludeLinks} */}
      {/*   className={marginClass} */}
      {/* /> */}
      <Switch
        labelText="Configure Columns"
        isChecked={includeCustomColumns && showCustomColumns ? true : false}
        onToggle={setShowCustomColumns}
        isDisabled={!includeCustomColumns ? true : false}
        className={marginClass}
      />
      {includeCustomColumns && showCustomColumns && 'Column Config Rows'}
      {/* <Flex marginTop={margin}> */}
      {/*   {includeCustomColumns && positionKeySelect} */}
      {/*   {includeCustomColumns && subtradeKeySelect} */}
      {/* </Flex> */}
      {/* <Switch */}
      {/*   labelText="Include Subtrades" */}
      {/*   isChecked={includeSubtrades} */}
      {/*   onToggle={setIncludeSubtrades} */}
      {/*   className={marginClass} */}
      {/* /> */}
      <Switch
       labelText="Configure Subtrade Columns"
       isChecked={showCustomSubtradeColumns}
       isChecked={includeCustomSubtradeColumns && showCustomSubtradeColumns ? true : false}
       onToggle={setShowCustomSubtradeColumns}
       isDisabled={!includeCustomSubtradeColumns ? true : false}
       className={marginClass}
     />
     {includeCustomSubtradeColumns && showCustomSubtradeColumns && 'Column Subtrade Config Rows'}
    </>
  )


  return (
    <div className="trade-group">
      {/* <Switch */}
      {/*   labelText='Use Custom Config?' */}
      {/*   isChecked={useCustomConfig} */}
      {/*   onToggle={setUseCustomConfig} */}
      {/* /> */}
      {/* {useCustomConfig && configOptions} */}
      {configOptions}
    </div>
  )
}

export default Config

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