
function User({className}) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
        <div className="rounded-full bg-amber-400 h-8 w-8 flex justify-center items-center">
            <p>JD</p>
        </div>
        <div className="flex flex-col items-center">
            <h3 className="ml-2 font-semibold">John Doe</h3>
            <p className="text-xs">Manager</p>
        </div>
    </div>
  )
}

export default User
