import { useState, useEffect } from 'react'
import { TextField } from '@contentful/forma-36-react-components'

const SubjectLine = ({ updateValue }) => {

  const [value, setValue] = useState('')

  const key = 'subject-line'

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
        labelText="Subject Line"
        helpText="Optional - defaults to entry title"
        onChange={event => setValue(event.target.value)}
      />
    </>
  )
}

export default SubjectLine
