import { useLocation } from "react-router"
function NameDate() {
    const location = useLocation()
    const date = new Date()
    const fullDate = date.toLocaleDateString('en-US', {
        year: "numeric",
        month: "long",
        day: "numeric"
    })

  return (
    <div className="mt-8 ml-8">
        <h1 className="text-5xl font-bold">{location.pathname.slice(1)}</h1>
        <p>{fullDate}</p>
    </div>
  )
}

export default NameDate
