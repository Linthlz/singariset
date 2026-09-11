import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Riset from './pages/Riset.jsx';
import RisetDetail from './pages/RisetDetail.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Kolaborasi from './pages/Kolaborasi.jsx';
import EtikaRegulasi from './pages/EtikaRegulasi.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import OpdDashboard from './pages/dashboard/OpdDashboard.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Halaman autentikasi — tanpa header/footer portal */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard — shell tersendiri, dibatasi peran */}
      <Route
        path="/dashboard/opd"
        element={<ProtectedRoute allow={['opd', 'admin']}><OpdDashboard /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/admin"
        element={<ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>}
      />
      {/* Tautan lama modul monev kini mengarah ke dashboard OPD */}
      <Route path="/monev" element={<Navigate to="/dashboard/opd" replace />} />

      {/* Portal publik */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/riset" element={<Riset />} />
        <Route path="/riset/:id" element={<RisetDetail />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/kolaborasi" element={<Kolaborasi />} />
        <Route path="/etika-regulasi" element={<EtikaRegulasi />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
