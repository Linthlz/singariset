import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home from './pages/Home.jsx';
import Riset from './pages/Riset.jsx';
import RisetDetail from './pages/RisetDetail.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Berita from './pages/Berita.jsx';
import Publikasi from './pages/Publikasi.jsx';
import Kolaborasi from './pages/Kolaborasi.jsx';
import EtikaRegulasi from './pages/EtikaRegulasi.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import OpdDashboard from './pages/dashboard/OpdDashboard.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import MitraDashboard from './pages/dashboard/MitraDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Halaman autentikasi — tanpa header/footer portal */}
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

      {/* Dashboard — shell tersendiri, dibatasi peran */}
      <Route
        path="/dashboard/opd"
        element={<ProtectedRoute allow={['opd', 'admin']}><OpdDashboard /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/admin"
        element={<ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/mitra"
        element={<ProtectedRoute allow={['mitra']}><MitraDashboard /></ProtectedRoute>}
      />
      {/* Tautan lama modul monev kini mengarah ke dashboard OPD */}
      <Route path="/monev" element={<Navigate to="/dashboard/opd" replace />} />

      {/* Portal publik */}
      <Route element={<Layout />}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/riset" element={<PageTransition><Riset /></PageTransition>} />
        <Route path="/riset/:id" element={<PageTransition><RisetDetail /></PageTransition>} />
        <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
        <Route path="/berita" element={<PageTransition><Berita /></PageTransition>} />
        <Route path="/publikasi" element={<PageTransition><Publikasi /></PageTransition>} />
        <Route
          path="/kolaborasi"
          element={<ProtectedRoute allow={['mitra']}><PageTransition><Kolaborasi /></PageTransition></ProtectedRoute>}
        />
        <Route path="/etika-regulasi" element={<PageTransition><EtikaRegulasi /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Route>
    </Routes>
  );
}
