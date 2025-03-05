import React, { useState } from 'react'
import Calendar from '../../components/Calendar'
import Navigation from '../../components/Navigation'
import ToolBar from '../../components/toolbar'
import Modal from '../../components/Modal'
import AppointmentForm from '../../components/AppointmentForm'


function Appointments() {
  const [modal, setModal] = useState(false)

  const openModal = () =>{
    setModal(true)
  }
  return (
    <div className='flex h-full overflow-hidden '>
      {modal && (< Modal close={() => setModal(false)} title={"Create New Appointment"}>
      < AppointmentForm/>
      </Modal>
      )}
      < Navigation/>
      <div className='w-full h-full'>
        <ToolBar>
        <button className='border-1 p-0.5 pl-3 pr-3 rounded-md' onClick={openModal}>+ New</button>
        </ToolBar>
        <Calendar/>
      </div>
    </div>
  )
}

export default Appointments