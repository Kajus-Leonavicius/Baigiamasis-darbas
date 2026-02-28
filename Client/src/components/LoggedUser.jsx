import React from 'react'

function LoggedUser() {
  return (
    <div className='p-2 flex justify-center items-center gap-2 border-b-1 mb-2'>
        <div className='rounded-full bg-blue-500 h-8 w-8 flex items-center justify-center'>
            <p>{localStorage.getItem('name').charAt(0)}</p>
            <p>{localStorage.getItem('surname').charAt(0)}</p>
        </div>
        <div>
            <div className='flex text-lg font-bold gap-2'>
                <p>{localStorage.getItem('name')}</p>
                <p>{localStorage.getItem('surname')}</p>
            </div>
            <div>
                <p className=''>{localStorage.getItem('role')}</p>
            </div>
        </div>
    </div>
  )
}

export default LoggedUser