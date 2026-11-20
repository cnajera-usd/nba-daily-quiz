import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getTodayPacific } from './utils/pacificDate'
import { ensureSession } from './lib/auth'
import '@/styles/index.css'
import App from './App'

ensureSession()

createRoot(document.getElementById('root')).render(
  <StrictMode>


    <App />
  </StrictMode>
)

