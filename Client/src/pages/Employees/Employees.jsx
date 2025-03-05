import React from 'react'
import Navigation from '../../components/Navigation.jsx'
import ToolBar from '../../components/ToolBar.jsx'
import DataTable from '../../components/DataTable.jsx'

function Employees() {
  return (
    <div className='h-full flex w-full'>
      <Navigation/>
      <div className='w-full'>
        <ToolBar>
          <button className='border-1 p-0.5 pl-3 pr-3 rounded-md'>+ New</button>
        </ToolBar>
        <DataTable/>
      </div>
    </div>
  )
}

export default Employees