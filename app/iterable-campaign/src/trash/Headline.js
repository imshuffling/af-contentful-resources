import { useState, useEffect } from 'react'
import { TextField } from '@contentful/forma-36-react-components'

const Headline = ({ updateValue }) => {

  const [value, setValue] = useState('')

  const key = 'headline'

  useEffect(() => {
    updateValue(key, value)
  }, [value])

  return (
    <>
      <TextField
        value={value}
        maxLength={255}
        name={key}
        id={key}
        labelText="Headline"
        helpText="Optional - defaults to entry title"
        onChange={event => setValue(event.target.value)}
      />
    </>
  )
}

export default Headline
