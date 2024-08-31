import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import { useState } from 'react'
import Navbar from './components/Navbar'
import LoginedNavbar from './components/LoginedNavbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import CreateNote from './pages/CreateNote'


function App() {

  const [isLogined,setIsLogined] = useState(false);
  const [searchQuery,setSearchQuery] = useState([]);

  const handleSetLogin = ()=>{
    setIsLogined(true)
  }
  const handleSetLogin2 = ()=>{
    setIsLogined(false);
  }
 
  return (
    <>
      <Router>
    {!isLogined?<Navbar />: <LoginedNavbar handleSetLogin2={handleSetLogin2} setSearchQuery={setSearchQuery} />}

        <Routes>
            <Route path='/' element={<Home isLogined={isLogined} searchQuery={searchQuery} />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login handleSetLogin={handleSetLogin} />} />
            <Route path='/notes' element={<CreateNote />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
