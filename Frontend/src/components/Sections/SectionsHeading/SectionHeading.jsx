import React from 'react'


const SectionHedding = ({title}) => {
  return (
    <div className='flex flex-wrap px-10 my-5'>
        <div className='border rounded border-1 bg-black w-2 h-10'>
        </div>
        <p className='text-2xl'>{title}</p>
    </div>
  )  
}

SectionHedding.defaultProps={

}

SectionHedding.prototype={
    title:String
}
export default SectionHedding