import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ensureSession, handleGoogleRedirectError } from './lib/auth'
import '@/styles/index.css'
import App from './App'

ensureSession()
handleGoogleRedirectError()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)