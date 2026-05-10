import { useState } from 'react'
import { usePlaces } from '../hooks/usePlaces'

export default function CitySearch() {
  const [query, setQuery] = useState('')
  const { search, data, loading, error } = usePlaces()

  const handleSearch = () => {
    if (query.trim()) search(query.trim())
  }

  const places = data?.top_places || []

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-6">Explore a city</h1>

      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Search a city (e.g. Rome, Bangkok)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {places.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            Top places in {data?.destination}
          </p>
          <div className="space-y-3">
            {places.map((place, i) => (
              <div key={place.id || i} className="border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{place.name}</p>
                    <p className="text-xs text-teal-600 mt-0.5">{place.category}</p>
                    <p className="text-sm text-gray-500 mt-1">{place.description}</p>
                  </div>
                  <span className="text-2xl ml-3">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📍'}
                  </span>
                </div>
                {place.why_visit && (
                  <p className="text-xs text-gray-400 mt-2 italic">
                    💡 {place.why_visit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}