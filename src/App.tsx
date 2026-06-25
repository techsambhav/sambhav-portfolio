import { BrowserRouter, Routes, Route } from 'react-router'
import Portfolio from './pages/Portfolio'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      {/* Sleek toast notification provider */}
      <Toaster position="bottom-right" theme="dark" closeButton />
    </>
  )
}
