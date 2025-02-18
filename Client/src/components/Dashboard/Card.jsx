
function Card({title, item}) {
  return (
    <div className="h-54 ml-8 mr-8 p-4 rounded-2xl bg-white hover:-translate-y-4 transition-transform duration-300 hover:drop-shadow-md">
        <p>{title}</p>
        <p>{item}</p>
    </div>
  )
}

export default Card
