import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import Quiz from '@/pages/Quiz'
import Admin from './pages/Admin'
import Privacy from './pages/Privacy'

import Results from '@/pages/Results'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/results" element={<Results />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
    </BrowserRouter>
  )
}
