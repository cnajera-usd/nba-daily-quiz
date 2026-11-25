import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import Quiz from '@/pages/Quiz'
import Admin from './pages/Admin'
import Leaderboard from '@/pages/Leaderboard'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
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
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
    </BrowserRouter>
  )
}
