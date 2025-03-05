import React from 'react'

function toolbar({children}) {
  return (
    <div className='p-2 border-b flex justify-end'>
        {children}
    </div>
  )
}

export default toolbar