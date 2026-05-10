import { useState } from 'react'
import { fetchCatalog } from '../services/api'

export function useGenerateCatalog() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generate = async (destination, start_date, end_date) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchCatalog(destination, start_date, end_date)
      setData(result)
      return result
    } catch (err) {
      setError(err.response?.data?.detail || 'Catalog generation failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generate, data, loading, error }
}