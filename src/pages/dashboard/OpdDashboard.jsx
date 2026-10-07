import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import Icon from '../../components/Icon.jsx';
import MonevFormPage from '../MonevFormPage.jsx';
import MonevModule from './MonevModule.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMonev } from '../../context/MonevContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { tanggal } from '../../lib/format.js';

const MENU_ITEMS = {
  'kelola-monev': { id: 'kelola-monev', label: 'Kelola Monev', ikon: 'chart' },
  'isi-monev': { id: 'isi-monev', label: 'Isi Form Monev', ikon: 'doc' },
  'riwayat-monev': { id: 'riwayat-monev', label: 'Riwayat Monev', ikon: 'clock' }
};

// Pegawai BRIDA mengelola Monev; akun OPD hanya mengisi dan memperbarui laporan instansinya.
const MENU_PER_ROLE = {
  'pegawai-brida': ['kelola-monev', 'riwayat-monev'],
  admin: ['kelola-monev', 'isi-monev', 'riwayat-monev'],
  opd: ['isi-monev', 'riwayat-monev']
};

const FIELD_JAWABAN = [
  ['uraian', 'Uraian hasil monitoring'],
  ['kendala', 'Kendala pelaksanaan rekomendasi'],
  ['manfaat', 'Manfaat kajian']
];

function ringkasan(record) {
  const sudah = record.rekomendasi.filter((item) => item.monitoring === 'Sudah').length;
  return { sudah, total: record.rekomendasi.length };
}

function EditMonev({ record, onClose }) {
  const { updateMonev } = useMonev();
  const toast = useToast();
  const [draft, setDraft] = useState(() => record.rekomendasi.map((item) => ({ ...item })));
  const [errors, setErrors] = useState({});

  const ubah = (index, field, value) => {
    setDraft((list) => list.map((item, i) => i === index ? { ...item, [field]: value } : item));
    setErrors((prev) => ({ ...prev, [`${index}-${field}`]: '' }));
  };

  function pilihFile(event, index) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [`${index}-file`]: 'Ukuran file maksimal 10 MB.' }));
      event.target.value = '';
      return;
    }
    setErrors((prev) => ({ ...prev, [`${index}-file`]: '' }));
    setDraft((list) => list.map((item, i) => i === index
      ? { ...item, fileName: file.name, fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB` }
      : item));
  }

  function simpan(event) {
    event.preventDefault();
    const nextErrors = {};
    draft.forEach((item, index) => {
      ['monitoring', 'uraian', 'kendala', 'manfaat'].forEach((field) => {
        if (!String(item[field] || '').trim()) nextErrors[`${index}-${field}`] = 'Field ini wajib diisi.';
      });
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    try {
      updateMonev(record.id, draft);
      toast('success', 'Laporan Monev diperbarui', `${record.id} telah disimpan.`);
      onClose();
    } catch (error) {
      toast('danger', 'Gagal memperbarui', error.message);
    }
  }

  const galat = (key) => errors[key] && <p className="m-0 mt-1 text-xs font-medium text-danger">{errors[key]}</p>;

  return (
    <form onSubmit={simpan} className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
      {draft.map((item, index) => (
        <fieldset key={index} className="m-0 rounded-lg border border-line bg-surface-1 p-4">
          <legend className="px-1 text-[.84rem] font-semibold text-ink">{index + 1}. {item.judul}</legend>
          <div className="mb-3 flex flex-wrap gap-2">
            {['Sudah', 'Belum'].map((option) => (
              <label key={option} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[.8rem] font-semibold ${item.monitoring === option ? 'border-maroon-800 bg-maroon-50 text-maroon-800' : 'border-line bg-white text-ink-2'}`}>
                <input type="radio" name={`edit-${record.id}-${index}`} value={option} checked={item.monitoring === option}
                  onChange={(e) => ubah(index, 'monitoring', e.target.value)} className="accent-maroon-800" />
                {option} dilaksanakan
              </label>
            ))}
          </div>
          {galat(`${index}-monitoring`)}
          <div className="grid gap-3 md:grid-cols-3">
            {FIELD_JAWABAN.map(([field, label]) => (
              <label key={field} className="flex flex-col gap-1.5 text-[.76rem] font-semibold text-ink-2">
                {label}
                <textarea rows={3} value={item[field] || ''} onChange={(e) => ubah(index, field, e.target.value)} className="input-base resize-y" />
                {galat(`${index}-${field}`)}
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[.78rem]">
            <label className="cursor-pointer rounded-lg border border-line-strong bg-white px-3 py-1.5 font-semibold text-maroon-800 hover:border-maroon-800">
              {item.fileName ? 'Ganti bukti' : 'Tambahkan bukti'}
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => pilihFile(e, index)} />
            </label>
            {item.fileName
              ? <span className="flex items-center gap-1.5 font-semibold text-info"><Icon name="doc" size={14} />{item.fileName} · {item.fileSize}</span>
              : <span className="text-ink-3">Belum ada bukti tindak lanjut.</span>}
          </div>
          {galat(`${index}-file`)}
        </fieldset>
      ))}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-lg border border-line-strong px-4 py-2 text-[.82rem] font-semibold text-ink-2 hover:bg-surface-1">Batal</button>
        <button type="submit" className="rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600">Simpan perubahan</button>
      </div>
    </form>
  );
}

function RiwayatMonev() {
  const { user } = useAuth();
  const { records, canManage, canEditRecord } = useMonev();
  const [editId, setEditId] = useState(null);
  // OPD hanya melihat laporan instansinya; pengelola Monev melihat seluruh laporan.
  const riwayat = canManage ? records : records.filter((record) => record.opd === user.instansi);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-line bg-white p-5.5">
        <h2 className="m-0 text-[1.05rem]">Riwayat input Monev</h2>
        <p className="mt-1 text-[.84rem] text-ink-3">
          {canManage ? 'Seluruh laporan Monev dari OPD.' : 'Hasil monitoring yang pernah diisi instansi Anda. Perbarui jawaban bila ada perkembangan tindak lanjut.'}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {riwayat.map((record) => {
            const { sudah, total } = ringkasan(record);
            const selesai = sudah === total;
            const editing = editId === record.id;
            return (
              <article key={record.id} className={`rounded-xl border p-4 transition ${editing ? 'border-maroon-100' : 'border-line hover:border-maroon-100 hover:bg-surface-1'}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="m-0 text-[.9rem] leading-snug">{record.judul}</h3>
                    <p className="m-0 mt-1.5 text-[.76rem] text-ink-3">
                      {record.id}{record.risetKode ? ` · ${record.risetKode}` : ''}{canManage ? ` · ${record.opd}` : ''} · Diisi {record.nama} pada {tanggal(record.createdAt.slice(0, 10))}
                      {record.updatedAt ? ` · Diperbarui ${tanggal(record.updatedAt.slice(0, 10))}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-none flex-wrap items-center gap-2 self-start">
                    <span className={`rounded-full px-2.5 py-1 text-[.7rem] font-bold ${selesai ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                      {sudah} dari {total} rekomendasi dilaksanakan
                    </span>
                    {canEditRecord(record) && !editing && (
                      <button type="button" onClick={() => setEditId(record.id)}
                        className="rounded-lg border border-line-strong px-3 py-1.5 text-[.76rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                        Perbarui
                      </button>
                    )}
                  </div>
                </div>
                {editing && <EditMonev record={record} onClose={() => setEditId(null)} />}
              </article>
            );
          })}
          {riwayat.length === 0 && <p className="m-0 py-6 text-center text-[.84rem] text-ink-3">Belum ada laporan Monev untuk {user.instansi}.</p>}
        </div>
      </section>
    </div>
  );
}

const JUDUL = {
  'kelola-monev': ['Monitoring & Evaluasi', () => 'Kelola poin rekomendasi dan tinjau tindak lanjut seluruh OPD'],
  'isi-monev': ['Isi Form Monitoring & Evaluasi', (user) => `${user.instansi} · Tahun Anggaran 2025`],
  'riwayat-monev': ['Riwayat Monev', (user) => `${user.instansi} · Riwayat pengajuan Monev`]
};

export default function OpdDashboard() {
  const { user } = useAuth();
  const menu = (MENU_PER_ROLE[user.backendRole] || MENU_PER_ROLE.opd).map((id) => MENU_ITEMS[id]);
  const [active, setActive] = useState(menu[0].id);
  const [title, subtitle] = JUDUL[active];

  return (
    <DashboardLayout menu={menu} active={active} onSelect={setActive} title={title} subtitle={subtitle(user)}>
      {active === 'kelola-monev' && <MonevModule />}
      {active === 'isi-monev' && <MonevFormPage />}
      {active === 'riwayat-monev' && <RiwayatMonev />}
    </DashboardLayout>
  );
}
