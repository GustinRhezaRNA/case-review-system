import { Routes, Route } from 'react-router-dom'
import Dashboard from "./app/(protected)/dashboard/page"
import CaseDetailPage from "./app/(protected)/dashboard/[id]/page"

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/:id" element={<CaseDetailPage />} />
    </Routes>
  )
}

export default App
