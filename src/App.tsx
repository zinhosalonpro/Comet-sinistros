import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { sinistros } from './data/sinistros'
import { SinistrosList } from './components/SinistrosList'
import { SinistroDetail } from './components/SinistroDetail'

function SinistroPage() {
  const { id } = useParams<{ id: string }>()
  const sinistro = sinistros.find((s) => s.id === id)
  if (!sinistro) return <Navigate to="/" replace />
  return <SinistroDetail sinistro={sinistro} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SinistrosList sinistros={sinistros} />} />
        <Route path="/sinistro/:id" element={<SinistroPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
