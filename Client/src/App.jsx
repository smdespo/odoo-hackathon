import { useState } from 'react'
import SafarSaathiLogin from './Pages/Login'
<<<<<<< HEAD
import CreateTrip from './Pages/CreateTrip'
import ItineraryView from './Pages/ItineraryView'
import CitySearch from './Pages/CitySearch'
import './App.css'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
=======
import './App.css'
>>>>>>> origin/Frontend_Aavishkar

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<<<<<<< HEAD
      <Routes>
              <Route path="/trip" element={<CreateTrip />} />
              <Route path='/itinerary' element={<ItineraryView />} />

      </Routes>
=======
        <SafarSaathiLogin />
>>>>>>> origin/Frontend_Aavishkar
    </>
  )
}

export default App
