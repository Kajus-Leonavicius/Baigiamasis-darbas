import Card from "./Card"
function main() {
  return (
    <div className=" grid grid-cols-3 gap-8 mt-12 w-full">
        <Card title = "Today appointments: " item  = "15"/>
        <Card title = "Add New Appointment"/> 
        <Card title = "Go to Work Orders"/>
        <div className = "col-span-3">
            <p className="ml-8 mb-4">Upcoming Appointments: </p>
            <Card/>
        </div>
    </div>
  )
}

export default main
