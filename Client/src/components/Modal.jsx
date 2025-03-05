import React from 'react'

function Modal({close, title, children}) {
  return (
    <div onClick={()=>close()} className='fixed inset-0 z-50 flex justify-center items-center' style={{background: "rgba(0,0,0,0.5)"}}>
        <div onClick={(e) =>e.stopPropagation()} className='bg-white w-auto h-auto rounded-md p-4'>
            <h1 className='text-3xl font-semibold'>{title}</h1>
            <div>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Modal