import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGenerateCatalog } from '../hooks/useGenerateCatalog'
import { useAutoPlan } from '../hooks/useAutoPlan'

const CATEGORY_LABELS = {
  accommodation: ' Where to stay',
  dining: ' Where to eat',
  activities: ' Things to do',
}

export default function CreateTrip() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ destination: '', start_date: '', end_date: '' })
  const [catalog, setCatalog] = useState(null)
  const [step, setStep] = useState(1) // 1 = form, 2 = catalog, 3 = planning

  const { generate, loading: catalogLoading, error: catalogError } = useGenerateCatalog()
  const { plan, loading: planLoading, error: planError } = useAutoPlan()

  // Step 1 → Step 2: generate catalog
  const handleGenerateCatalog = async () => {
    if (!form.destination || !form.start_date || !form.end_date) return
    const result = await generate(form.destination, form.start_date, form.end_date)
    if (result) {
      setCatalog(result)
      setStep(2)
    }
  }

  // Step 2 → Step 3: auto-plan itinerary from catalog
  const handleAutoPlan = async () => {
    if (!catalog) return
    setStep(3)
    const result = await plan(form.start_date, form.end_date, catalog.catalog)
    if (result) {
      // Save to localStorage so ItineraryView can read it
      localStorage.setItem('itinerary', JSON.stringify(result.itinerary))
      localStorage.setItem('tripMeta', JSON.stringify({
        destination: form.destination,
        start_date: form.start_date,
        end_date: form.end_date,
        weather: catalog.destination_meta?.weather_context,
      }))
      navigate('/itinerary')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-2">Plan a new trip</h1>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {['Trip details', 'Review catalog', 'Building plan'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center
              ${step > i + 1 ? 'bg-teal-600 text-white' :
                step === i + 1 ? 'bg-teal-100 text-teal-700 border border-teal-400' :
                'bg-gray-100 text-gray-400'}`}>
              {i + 1}
            </span>
            <span className="text-sm text-gray-500">{label}</span>
            {i < 2 && <span className="text-gray-300 mx-1">→</span>}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Form ── */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Destination (e.g. Paris, Tokyo)"
            value={form.destination}
            onChange={e => setForm({ ...form, destination: e.target.value })}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Start date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.start_date}
                onChange={e => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">End date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={form.end_date}
                onChange={e => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>

          {catalogError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{catalogError}</div>
          )}

          <button
            onClick={handleGenerateCatalog}
            disabled={catalogLoading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {catalogLoading ? '⏳ Finding best places...' : 'Find places →'}
          </button>
        </div>
      )}

      {/* ── STEP 2: Catalog review ── */}
      {step === 2 && catalog && (
        <div>
          {catalog.destination_meta?.weather_context && (
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm mb-6">
              🌤 {catalog.destination_meta.weather_context}
            </div>
          )}

          {Object.entries(catalog.catalog).map(([category, items]) => (
            <section key={category} className="mb-8">
              <h2 className="text-base font-medium mb-3">
                {CATEGORY_LABELS[category] || category}
              </h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-4 flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        ⏱ {item.default_duration_hours}h &nbsp;·&nbsp; 💵 ${item.estimated_cost}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg"
            >
              ← Back
            </button>
            <button
              onClick={handleAutoPlan}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-medium"
            >
              Auto-plan my itinerary →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Building plan (loading state) ── */}
      {step === 3 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-lg font-medium mb-2">Building your itinerary...</p>
          <p className="text-sm text-gray-500">
            Organizing {form.destination} day by day
          </p>
          {planError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mt-6">{planError}</div>
          )}
        </div>
      )}
    </div>
  )
}