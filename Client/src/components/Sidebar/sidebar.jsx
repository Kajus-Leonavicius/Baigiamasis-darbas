import MenuList from './MenuList.jsx'
import User from './User.jsx'
function sidebar() {
  return (
    <div className='flex flex-col  h-full items-center w-48 bg-white'>
        < User className="mt-4"/>
        <MenuList/>
    </div>
  )
}

export default sidebar
