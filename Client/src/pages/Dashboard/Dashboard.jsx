import Sidebar from '../../components/Sidebar/sidebar.jsx'
import NameDate from '../../components/shared/NameDate.jsx'
import Main from '../../components/Dashboard/main.jsx'
import User from '../../components/Sidebar/User.jsx'

function Dashboard (){

  return(
    <div className='h-full w-full bg-[#EFF3F4] flex overflow-hidden'>
      <Sidebar/>
      <div className='w-full'>
        <div className='flex justify-between items-center'>
          <NameDate/>
          <User className = "mr-8"/>
        </div>
        <Main/>
      </div>
    </div>
  )
}

export default Dashboard
