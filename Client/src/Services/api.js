import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})
export const fetchPlaces = (destination) =>
  api.post('/places', { destination }).then(r => r.data)


export const fetchCatalog = (destination, start_date, end_date) =>
  api.post('/generate-catalog', { destination, start_date, end_date }).then(r => r.data)


export const fetchAutoPlan = (start_date, end_date, catalog) =>
  api.post('/auto-plan', { start_date, end_date, catalog }).then(r => r.data)