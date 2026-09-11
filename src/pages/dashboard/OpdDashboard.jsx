import DashboardLayout from '../../components/DashboardLayout.jsx';
import MonevModule from './MonevModule.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const MENU = [
  { id: 'monev', label: 'Monitoring & Evaluasi', ikon: 'chart' }
];

export default function OpdDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      menu={MENU}
      active="monev"
      onSelect={() => {}}
      title="Monitoring & Evaluasi Riset Daerah"
      subtitle={`${user.instansi} · Tahun Anggaran 2025 · Siklus Monev Tahap III`}
    >
      <MonevModule />
    </DashboardLayout>
  );
}
