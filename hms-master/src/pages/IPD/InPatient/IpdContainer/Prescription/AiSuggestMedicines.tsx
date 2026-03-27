import React from 'react'

const AiSuggestMedicines = (props: any) => {

  return (
    <React.Fragment>
      {props.data.map((data: any, idx: any) => (
        <>
          <label>name {data.name}</label><br />
        </>
      ))}
    </React.Fragment>

  )
}

export default AiSuggestMedicines