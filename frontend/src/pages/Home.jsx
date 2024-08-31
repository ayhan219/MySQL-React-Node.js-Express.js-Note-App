import React from 'react'

import Header from '../components/Header'


const Home = ({isLogined,searchQuery}) => {
  return (
   <div>
    <Header searchQuery={searchQuery} /> 
   </div>
  )
}

export default Home