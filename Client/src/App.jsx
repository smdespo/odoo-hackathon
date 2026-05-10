import { useState } from 'react'
import SafarSaathiLogin from './Pages/Login'
import CreateTrip from './Pages/CreateTrip'
import ItineraryView from './Pages/ItineraryView'
import CitySearch from './Pages/CitySearch'
import './App.css'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
              <Route path="/trip" element={<CreateTrip />} />
              <Route path='/itinerary' element={<ItineraryView />} />

      </Routes>
    </>
  )
}

export default App
