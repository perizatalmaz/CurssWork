import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ReservationListPage from './pages/ReservationListPage'
import ReservationFormPage from './pages/ReservationFormPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

function ProtectedRoute({ children }) {
  const role = localStorage.getItem('userRole')
  if (!role) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><ReservationListPage /></ProtectedRoute>} />
        <Route path="/new" element={<ProtectedRoute><ReservationFormPage /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><ReservationFormPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
