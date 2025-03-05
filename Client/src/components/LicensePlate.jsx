    import React from 'react'
    import flag from '../assets/Flag_of_Europe.svg'

    function LicensePlate({number}) {
    return (
        <div className='w-38 rounded-md border-1 flex items-center'>
            <span className='h-auto w-12 overflow-hidden rounded-l-md'><img src={flag} alt="" className='object-cover'/></span>
            <p className='ml-4'>{number}</p>
        </div>
    )
    }

    export default LicensePlate