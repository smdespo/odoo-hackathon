import { useEffect, useState } from 'react'
    
import { useNavigate } from 'react-router-dom'

const TYPE_ICON = {
  activity: '🎯',
  dining: '🍽️',
  accommodation: '🏨',
}

export default function ItineraryView() {
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState([])
  const [meta, setMeta] = useState(null)
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('itinerary')
    const savedMeta = localStorage.getItem('tripMeta')
    if (!saved) { navigate('/create'); return }
    setItinerary(JSON.parse(saved))
    if (savedMeta) setMeta(JSON.parse(savedMeta))
  }, [])

  if (!itinerary.length) return null

  const day = itinerary[activeDay]

  // Calculate total cost for the day
  const dayCost = day.schedule.reduce((sum, s) => sum + (s.item?.estimated_cost || 0), 0)

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium">{meta?.destination || 'Your Trip'}</h1>
        {meta?.weather && (
          <p className="text-sm text-gray-500 mt-1">🌤 {meta.weather}</p>
        )}
        <p className="text-sm text-gray-400">
          {meta?.start_date} → {meta?.end_date}
        </p>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {itinerary.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeDay === i
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Day {d.day_number}
            <span className="block text-xs opacity-70">{d.date}</span>
          </button>
        ))}
      </div>

      {/* Accommodation (only Day 1) */}
      {day.accommodation && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-teal-600 font-medium mb-1">🏨 Check-in</p>
          <p className="font-medium">{day.accommodation.title}</p>
          <p className="text-sm text-gray-500">{day.accommodation.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            💵 ${day.accommodation.estimated_cost}/night
          </p>
        </div>
      )}

      {/* Schedule timeline */}
      <div className="space-y-4">
        {day.schedule.map((slot, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-14 text-xs text-gray-400 pt-1 flex-shrink-0">{slot.time}</div>
            <div className="flex-1 border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-gray-400 capitalize">
                    {TYPE_ICON[slot.type]} {slot.type}
                  </span>
                  <p className="font-medium mt-0.5">{slot.item?.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{slot.item?.description}</p>
                </div>
                <span className="text-sm font-medium text-teal-700 ml-4">
                  ${slot.item?.estimated_cost}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                ⏱ {slot.item?.default_duration_hours}h
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Day cost summary */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Estimated day cost</span>
        <span className="font-medium text-lg">${dayCost}</span>
      </div>

      {/* Nav */}
      <button
        onClick={() => navigate('/create')}
        className="mt-6 w-full border border-gray-300 text-gray-600 py-3 rounded-lg text-sm"
      >
        ← Plan another trip
      </button>
    </div>
  )
}