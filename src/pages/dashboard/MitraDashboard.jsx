import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { STATUS_USULAN, useSubmissions } from '../../context/SubmissionsContext.jsx';
import { bidangById, kecById, skemaById, tanggal } from '../../lib/format.js';

const MENU = [{ id: 'pengajuan', label: 'Pengajuan Riset Saya', ikon: 'flask' }];

const FILTER = [
  { id: '', label: 'Semua' },
  { id: 'diajukan', label: 'Diajukan' },
  { id: 'berjalan', label: 'Berjalan' },
  { id: 'ditolak', label: 'Ditolak' }
];

function Card({ title, desc, action, children }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5.5">
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="m-0 text-[1.02rem]">{title}</h2>}
            {desc && <p className="m-0 mt-0.5 text-[.8rem] text-ink-3">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function PengajuanSaya() {
  const { user } = useAuth();
  const { submissions } = useSubmissions();
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState(null);

  const milikSaya = useMemo(
    () => submissions.filter((s) => s.mitraEmail === user.email),
    [submissions, user.email]
  );

  const hits = filter ? milikSaya.filter((s) => s.status === filter) : milikSaya;

  const kpi = [
    { l: 'Total pengajuan', v: milikSaya.length },
    { l: 'Diajukan', v: milikSaya.filter((s) => s.status === 'diajukan').length },
    { l: 'Berjalan', v: milikSaya.filter((s) => s.status === 'berjalan').length },
    { l: 'Ditolak', v: milikSaya.filter((s) => s.status === 'ditolak').length }
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpi.map((k) => (
          <div key={k.l} className="rounded-xl border border-line bg-white p-4.5">
            <div className="text-[.78rem] font-semibold text-ink-3">{k.l}</div>
            <div className="mt-1 text-[1.75rem] font-extrabold leading-tight text-ink">{k.v}</div>
          </div>
        ))}
      </div>

      <Card
        title="Riwayat pengajuan kolaborasi riset"
        desc="Pantau status verifikasi hingga penetapan setiap usulan yang Anda kirim."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Saring status pengajuan">
              {FILTER.map((f) => (
                <button
                  key={f.id || 'semua'} type="button" onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={`rounded-full border px-3 py-1.5 text-[.78rem] font-semibold transition ${
                    filter === f.id ? 'border-maroon-800 bg-maroon-800 text-white' : 'border-line-strong bg-white text-ink-2 hover:border-maroon-600 hover:text-maroon-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Link to="/kolaborasi" className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white no-underline hover:bg-maroon-600">
              <Icon name="plus" size={15} /> Ajukan riset baru
            </Link>
          </div>
        }
      >
        {hits.length === 0 ? (
          <div className="py-12 text-center text-ink-3">
            <Icon name="flask" size={40} className="mx-auto mb-3 opacity-40" />
            <h3 className="text-[1rem] text-ink-2">Belum ada pengajuan pada kategori ini</h3>
            <p className="mb-0">Gunakan tombol &quot;Ajukan riset baru&quot; untuk mengirim usulan kolaborasi riset.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[760px] border-collapse text-[.845rem]">
              <caption className="sr-only">Daftar pengajuan riset saya</caption>
              <thead>
                <tr className="border-b border-line bg-surface-1">
                  {['No. registrasi', 'Judul & skema', 'Bidang', 'Tanggal ajuan', 'Status', 'Aksi'].map((h) => (
                    <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 text-left text-[.72rem] font-bold uppercase tracking-wide text-ink-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hits.map((s) => {
                  const st = STATUS_USULAN[s.status];
                  return (
                    <tr key={s.id} className="border-b border-line last:border-0 hover:bg-surface-1">
                      <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">{s.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="max-w-[320px] font-semibold text-ink">{s.judul}</div>
                        <div className="text-[.765rem] text-ink-3">{skemaById(s.skema).nama}</div>
                      </td>
                      <td className="px-4 py-3.5 text-ink-2">{bidangById(s.bidang).nama.split(' ')[0]}</td>
                      <td className="px-4 py-3.5 tabular-nums text-ink-2">{tanggal(s.createdAt.slice(0, 10))}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.badge}`}>
                          <Icon name={st.ikon} size={12} /> {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button type="button" onClick={() => setDetail(s)}
                          className="rounded-lg border border-line-strong px-3 py-1.5 text-[.78rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                          Lihat detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-[.82rem] text-ink-3">Menampilkan {hits.length} dari {milikSaya.length} pengajuan.</p>
      </Card>

      {detail && (
        <Modal title={detail.judul} wide onClose={() => setDetail(null)}>
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${STATUS_USULAN[detail.status].badge}`}>
              <Icon name={STATUS_USULAN[detail.status].ikon} size={12} /> {STATUS_USULAN[detail.status].label}
            </span>
            <span className="text-[.78rem] text-ink-3">No. registrasi {detail.id} · Diajukan {tanggal(detail.createdAt.slice(0, 10))}</span>
          </div>

          <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.75 text-[.845rem]">
            <dt className="font-semibold text-ink-3">Skema</dt><dd className="m-0 font-semibold">{skemaById(detail.skema).nama}</dd>
            <dt className="font-semibold text-ink-3">Bidang</dt><dd className="m-0 font-semibold">{bidangById(detail.bidang).nama}</dd>
            <dt className="font-semibold text-ink-3">Lokasi</dt><dd className="m-0 font-semibold">{detail.kecamatan === 'lintas' ? 'Lintas kecamatan' : kecById(detail.kecamatan).nama}</dd>
            <dt className="font-semibold text-ink-3">Usulan dana</dt><dd className="m-0 font-semibold">Rp {detail.dana}</dd>
            <dt className="font-semibold text-ink-3">Berkas</dt><dd className="m-0 font-semibold">{detail.files?.length || 0} dokumen</dd>
          </dl>

          <h4 className="mb-2 text-[.92rem]">Urgensi</h4>
          <p className="mb-4 whitespace-pre-line text-[.86rem] leading-relaxed text-ink-2">{detail.urgensi}</p>

          <h4 className="mb-2 text-[.92rem]">Luaran</h4>
          <p className="mb-4 whitespace-pre-line text-[.86rem] leading-relaxed text-ink-2">{detail.luaran}</p>

          {detail.status === 'ditolak' && (
            <div className="flex items-start gap-3 rounded-xl border border-danger-bg bg-danger-bg px-4 py-3.5 text-[.855rem] text-danger">
              <Icon name="alert" size={19} className="mt-0.5 flex-none" />
              <p className="m-0"><strong className="mr-1">Catatan penolakan.</strong>{detail.catatan || 'Tidak ada catatan tambahan dari BRIDA.'}</p>
            </div>
          )}
          {detail.status === 'berjalan' && (
            <div className="flex items-start gap-3 rounded-xl border border-success-bg bg-success-bg px-4 py-3.5 text-[.855rem] text-[#14532D]">
              <Icon name="checkCircle" size={19} className="mt-0.5 flex-none text-success" />
              <p className="m-0">Pengajuan telah disetujui dan riset berjalan dalam pemantauan BRIDA.</p>
            </div>
          )}
          {detail.status === 'diajukan' && (
            <div className="flex items-start gap-3 rounded-xl border border-warning-bg bg-warning-bg px-4 py-3.5 text-[.855rem] text-[#78350F]">
              <Icon name="clock" size={19} className="mt-0.5 flex-none text-warning" />
              <p className="m-0">Masih dalam antrean verifikasi administrasi dan telaah substansi tim pakar BRIDA.</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default function MitraDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      menu={MENU}
      active="pengajuan"
      onSelect={() => {}}
      title="Dashboard Mitra"
      subtitle={`${user.instansi} · Monitoring pengajuan kolaborasi riset`}
    >
      <PengajuanSaya />
    </DashboardLayout>
  );
}
