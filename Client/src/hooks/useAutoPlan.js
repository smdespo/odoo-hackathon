import { useState } from 'react'
import { fetchAutoPlan } from '../services/api'

export function useAutoPlan() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const plan = async (start_date, end_date, catalog) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAutoPlan(start_date, end_date, catalog)
      setData(result)
      return result
    } catch (err) {
      setError(err.response?.data?.detail || 'Auto-plan failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { plan, data, loading, error }
}