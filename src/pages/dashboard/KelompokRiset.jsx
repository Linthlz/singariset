import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import Modal from '../../components/Modal.jsx';
import SmartImage from '../../components/SmartImage.jsx';
import AsyncState, { EmptyState, ErrorState, SkeletonGrid } from '../../components/AsyncState.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useMutation } from '../../hooks/useData.js';
import { useGroupDeliverables, useGroupDetail, useGroupDocumentations, useMyGroups } from '../../hooks/useGroups.js';
import { useUsers } from '../../hooks/useUsers.js';
import { errorMessage } from '../../services/api.js';
import { contentService } from '../../services/contentService.js';
import { EDITABLE_FIELDS, GROUP_ROLE, groupService } from '../../services/groupService.js';
import { statusResearch } from '../../services/researchService.js';
import { rupiah, tanggal } from '../../lib/format.js';

/* ---------- komponen kecil ---------- */
function Card({ title, desc, action, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-line bg-white p-4 sm:p-5.5 ${className}`}>
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

function RoleBadge({ role }) {
  const r = GROUP_ROLE[role] || { label: role, badge: 'bg-surface-2 text-ink-2' };
  return <span className={`rounded-full px-2.5 py-1 text-[.71rem] font-bold ${r.badge}`}>{r.label}</span>;
}

function StatusBadge({ status }) {
  const st = statusResearch(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[.71rem] font-bold ${st.badge}`}>
      <Icon name={st.ikon} size={12} /> {st.label}
    </span>
  );
}

function Field({ label, error, children, full }) {
  return (
    <label className={`mb-4 block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-[.84rem] font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-[.78rem] font-semibold text-danger">{error}</span>}
    </label>
  );
}

function Konfirmasi({ judul, pesan, tombol, bahaya = true, onClose, onConfirm }) {
  const jalan = useMutation(onConfirm);
  return (
    <Modal title={judul} onClose={onClose} footer={
      <>
        <button type="button" onClick={onClose} disabled={jalan.loading}
          className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-white disabled:opacity-50">Batal</button>
        <button type="button" onClick={() => jalan.mutate().catch(() => {})} disabled={jalan.loading}
          className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${bahaya ? 'bg-danger hover:opacity-90' : 'bg-maroon-800 hover:bg-maroon-600'}`}>
          {jalan.loading ? 'Memproses…' : tombol}
        </button>
      </>
    }>
      <p className="m-0 text-[.9rem] text-ink-2">{pesan}</p>
      {jalan.error && <p role="alert" className="mb-0 mt-3 text-[.84rem] font-semibold text-danger">{errorMessage(jalan.error)}</p>}
    </Modal>
  );
}

/* ---------- gabung dengan kode ---------- */
function FormGabung({ onJoined }) {
  const toast = useToast();
  const [kode, setKode] = useState('');
  const [salah, setSalah] = useState('');
  const gabung = useMutation((k) => groupService.join(k));

  async function submit(e) {
    e.preventDefault();
    setSalah('');
    if (!kode.trim()) { setSalah('Masukkan kode gabung dari ketua peneliti.'); return; }
    try {
      const g = await gabung.mutate(kode);
      toast('success', 'Berhasil bergabung', `Anda kini anggota kelompok "${g?.name || 'riset'}".`);
      setKode('');
      onJoined(g?.public_id);
    } catch (err) {
      const pesan = { 404: 'Kode gabung tidak ditemukan. Periksa kembali kode dari ketua peneliti.', 409: 'Anda sudah menjadi bagian kelompok ini.', 403: 'Hanya akun peneliti/mitra yang dapat bergabung ke kelompok riset.' };
      setSalah(pesan[err?.status] || errorMessage(err));
    }
  }

  return (
    <Card title="Gabung ke kelompok riset" desc="Minta kode gabung kepada ketua peneliti, lalu masukkan di sini untuk menjadi anggota tim.">
      <form onSubmit={submit} noValidate className="flex flex-wrap items-start gap-2.5">
        <input className="input-base min-w-[min(220px,100%)] flex-1 font-mono uppercase tracking-wider" value={kode} maxLength={20}
          onChange={(e) => setKode(e.target.value)} placeholder="Contoh: SIST-2026-AB12" aria-label="Kode gabung" />
        <button type="submit" disabled={gabung.loading}
          className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
          <Icon name="users" size={15} /> {gabung.loading ? 'Memproses…' : 'Gabung'}
        </button>
      </form>
      {salah && <p role="alert" className="mb-0 mt-2.5 text-[.82rem] font-semibold text-danger">{salah}</p>}
    </Card>
  );
}

/* ---------- daftar kelompok ---------- */
function SinkronKelompok({ onSynced }) {
  const toast = useToast();
  const sinkron = useMutation(() => groupService.sync());

  async function jalankan() {
    try {
      const dibuat = await sinkron.mutate();
      toast('success', 'Sinkronisasi selesai', dibuat ? `${dibuat} kelompok riset dibuat untuk riset yang sudah disetujui.` : 'Semua riset yang disetujui sudah memiliki kelompok.');
      onSynced();
    } catch (err) {
      toast('danger', 'Sinkronisasi gagal', errorMessage(err));
    }
  }

  return (
    <button type="button" onClick={jalankan} disabled={sinkron.loading}
      className="flex items-center gap-1.5 rounded-lg border border-line-strong px-3.5 py-2 text-[.8rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50 disabled:opacity-60">
      <Icon name="refresh" size={14} /> {sinkron.loading ? 'Menyinkronkan…' : 'Sinkronkan kelompok'}
    </button>
  );
}

function DaftarKelompok({ admin, bolehGabung, judulKosong, onOpen }) {
  const { data, loading, error, reload } = useMyGroups({ admin });
  const list = data || [];

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {bolehGabung && <FormGabung onJoined={(id) => { reload(); if (id) onOpen(id); }} />}
      <Card title="Kelompok riset" desc="Kelompok terbentuk otomatis saat usulan riset disetujui BRIDA."
        action={admin && <SinkronKelompok onSynced={reload} />}>
        <AsyncState loading={loading} error={error} isEmpty={list.length === 0} onRetry={reload}
          skeleton={<SkeletonGrid count={2} className="grid gap-4 md:grid-cols-2" itemClassName="h-40" />}
          empty={<EmptyState icon="users" title={judulKosong} text="Kelompok riset muncul di sini setelah usulan disetujui atau setelah Anda bergabung dengan kode." />}>
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((g) => (
              <button key={g.id} type="button" onClick={() => onOpen(g.slug || g.id)}
                className="flex flex-col rounded-xl border border-line bg-white p-4.5 text-left transition hover:-translate-y-0.5 hover:border-maroon-600 hover:shadow-lift">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <RoleBadge role={g.peranSaya} />
                  {g.riset && <StatusBadge status={g.riset.status} />}
                </div>
                <span className="mb-1 text-[.95rem] font-bold leading-snug text-ink">{g.riset?.judul || g.nama}</span>
                <span className="mb-3 text-[.76rem] font-semibold tabular-nums text-ink-3">{g.riset?.kode}</span>
                <span className="mt-auto flex flex-col gap-1 text-[.8rem] text-ink-2">
                  <span className="flex items-center gap-1.5"><Icon name="user" size={13} className="text-maroon-800" />Ketua: {g.ketua?.nama || '-'}</span>
                  <span className="flex items-center gap-1.5"><Icon name="shield" size={13} className="text-[#8A6400]" />Pembimbing: {g.pembimbing?.nama || 'Belum ditetapkan'}</span>
                  <span className="flex items-center gap-1.5"><Icon name="users" size={13} className="text-ink-3" />{g.jumlahAnggota} orang dalam tim</span>
                </span>
              </button>
            ))}
          </div>
        </AsyncState>
      </Card>
    </div>
  );
}

/* ---------- edit riset (ketua) ---------- */
function EditRiset({ grupId, riset, onClose, onSaved }) {
  const [form, setForm] = useState(() => Object.fromEntries(EDITABLE_FIELDS.map(([k]) => [k, riset[k] || ''])));
  const [errors, setErrors] = useState({});
  const simpan = useMutation((f) => groupService.updateResearch(grupId, f));
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  async function submit(e) {
    e.preventDefault();
    const v = {};
    EDITABLE_FIELDS.forEach(([k, , label, , wajib]) => { if (wajib && !String(form[k]).trim()) v[k] = `${label} wajib diisi.`; });
    setErrors(v);
    if (Object.keys(v).length) return;
    try { onSaved(await simpan.mutate(form)); } catch { /* ditampilkan di bawah */ }
  }

  return (
    <Modal title="Edit informasi riset" wide onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <p className="mb-4 rounded-lg bg-info-bg px-3.5 py-3 text-[.82rem] text-[#1E3A8A]">
          Judul, bidang, skema, dana, dan sasaran RPJMD terkunci setelah usulan disetujui BRIDA. Hubungi pembimbing bila perlu diubah.
        </p>
        <div className="grid gap-x-4.5 sm:grid-cols-2">
          {EDITABLE_FIELDS.map(([k, , label, tipe]) => (
            <Field key={k} label={label} error={errors[k]} full={tipe === 'textarea'}>
              {tipe === 'textarea'
                ? <textarea className="input-base min-h-[100px]" value={form[k]} onChange={(e) => set(k, e.target.value)} />
                : <input className="input-base" maxLength={255} value={form[k]} onChange={(e) => set(k, e.target.value)} />}
            </Field>
          ))}
        </div>
        {simpan.error && <p role="alert" className="mb-3 text-[.84rem] font-semibold text-danger">{errorMessage(simpan.error)}</p>}
        <div className="flex flex-wrap justify-end gap-2.5 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-1">Batal</button>
          <button type="submit" disabled={simpan.loading} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
            {simpan.loading ? 'Menyimpan…' : 'Simpan perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- pembimbing ---------- */
function Pembimbing({ detail, onChanged }) {
  const toast = useToast();
  const admin = detail.peranSaya === 'admin';
  const reviewer = useUsers({ role: 'reviewer', limit: 100 });
  const [pilih, setPilih] = useState('');
  const simpan = useMutation((id) => groupService.setSupervisor(detail.id, id));
  const p = detail.pembimbing;

  async function ganti() {
    if (!pilih) return;
    try {
      const d = await simpan.mutate(pilih);
      toast('success', 'Pembimbing diperbarui', `${d.pembimbing?.nama || 'Reviewer'} kini menjadi pembimbing kelompok ini.`);
      setPilih('');
      onChanged(d);
    } catch { /* ditampilkan di bawah */ }
  }

  return (
    <Card title="Pembimbing BRIDA" desc="Reviewer BRIDA yang membimbing dan memantau riset ini.">
      {p ? (
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gold-50 text-[#8A6400]"><Icon name="shield" size={18} /></span>
          <div className="min-w-0 text-[.85rem]">
            <div className="font-semibold text-ink">{p.nama}</div>
            <div className="text-ink-3">{[p.jabatan, p.institusi].filter(Boolean).join(' · ') || 'BRIDA Kabupaten Buleleng'}</div>
            {p.email && <a href={`mailto:${p.email}`} className="text-[.82rem] font-semibold text-maroon-800 underline">{p.email}</a>}
          </div>
        </div>
      ) : (
        <p className="m-0 text-[.85rem] text-ink-3">Pembimbing belum ditetapkan.</p>
      )}
      {admin && (
        <div className="mt-4 border-t border-line pt-4">
          <span className="mb-1.5 block text-[.82rem] font-semibold text-ink">Ganti pembimbing</span>
          <div className="flex flex-wrap gap-2">
            <select className="input-base min-w-[min(200px,100%)] flex-1" value={pilih} onChange={(e) => setPilih(e.target.value)} aria-label="Pilih reviewer">
              <option value="">{reviewer.loading ? 'Memuat reviewer…' : 'Pilih reviewer BRIDA'}</option>
              {(reviewer.data || []).filter((u) => u.publicId !== p?.id).map((u) => <option key={u.publicId} value={u.publicId}>{u.nama}</option>)}
            </select>
            <button type="button" onClick={ganti} disabled={!pilih || simpan.loading}
              className="rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
              {simpan.loading ? 'Menyimpan…' : 'Tetapkan'}
            </button>
          </div>
          {simpan.error && <p role="alert" className="mb-0 mt-2 text-[.8rem] font-semibold text-danger">{errorMessage(simpan.error)}</p>}
        </div>
      )}
    </Card>
  );
}

/* ---------- anggota ---------- */
function Anggota({ detail, onChanged, onLeft }) {
  const toast = useToast();
  const [kode, setKode] = useState(detail.kodeGabung);
  const [aksi, setAksi] = useState(null); // { jenis: 'keluarkan'|'keluar'|'kode', anggota? }
  const tutup = useCallback(() => setAksi(null), []);
  const ketua = detail.peranSaya === 'leader';
  const kelola = ketua || detail.peranSaya === 'admin';

  async function salin() {
    try {
      await navigator.clipboard.writeText(kode);
      toast('success', 'Kode disalin', 'Bagikan kode ini kepada anggota tim Anda.');
    } catch {
      toast('info', 'Salin manual', kode);
    }
  }

  return (
    <Card title="Anggota tim" desc={`${detail.anggota.length} orang dalam kelompok`}>
      {kode && (
        <div className="mb-4 rounded-lg border border-dashed border-maroon-600 bg-maroon-50 p-3.5">
          <div className="mb-1 text-[.74rem] font-bold uppercase tracking-wide text-maroon-800">Kode gabung</div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex-1 font-mono text-[1.05rem] font-bold tracking-wider text-ink">{kode}</span>
            <button type="button" onClick={salin} className="rounded-lg border border-line-strong bg-white px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600">Salin</button>
            <button type="button" onClick={() => setAksi({ jenis: 'kode' })} className="rounded-lg border border-line-strong bg-white px-3 py-1.5 text-[.78rem] font-semibold text-ink-2 hover:border-maroon-600">Buat baru</button>
          </div>
          <p className="mb-0 mt-1.5 text-[.75rem] text-ink-3">Anggota dengan akun peneliti memasukkan kode ini di menu Kelompok Riset.</p>
        </div>
      )}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {detail.anggota.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-2.5 rounded-lg border border-line p-3">
            <span className="min-w-0 flex-1 text-[.84rem]">
              <span className="block font-semibold text-ink">{a.nama}</span>
              <span className="block truncate text-[.76rem] text-ink-3">{[a.jabatan, a.institusi].filter(Boolean).join(' · ') || a.email}</span>
            </span>
            <RoleBadge role={a.peran} />
            {kelola && a.peran !== 'leader' && (
              <button type="button" onClick={() => setAksi({ jenis: 'keluarkan', anggota: a })} aria-label={`Keluarkan ${a.nama}`}
                className="rounded-md p-1.5 text-ink-3 hover:bg-danger-bg hover:text-danger"><Icon name="trash" size={15} /></button>
            )}
          </li>
        ))}
      </ul>
      {detail.peranSaya === 'member' && (
        <button type="button" onClick={() => setAksi({ jenis: 'keluar' })}
          className="mt-4 w-full rounded-lg border border-danger px-4 py-2 text-[.82rem] font-semibold text-danger hover:bg-danger-bg">Keluar dari kelompok</button>
      )}

      {aksi?.jenis === 'keluarkan' && (
        <Konfirmasi judul="Keluarkan anggota?" tombol="Ya, keluarkan" onClose={tutup}
          pesan={`${aksi.anggota.nama} tidak akan lagi dapat mengakses kelompok ini. Ia dapat bergabung kembali dengan kode gabung.`}
          onConfirm={async () => { await groupService.removeMember(detail.id, aksi.anggota.id); setAksi(null); toast('info', 'Anggota dikeluarkan', aksi.anggota.nama); onChanged(); }} />
      )}
      {aksi?.jenis === 'keluar' && (
        <Konfirmasi judul="Keluar dari kelompok?" tombol="Ya, keluar" onClose={tutup}
          pesan="Anda tidak akan lagi dapat mengakses kelompok ini sampai bergabung kembali dengan kode dari ketua."
          onConfirm={async () => { await groupService.leave(detail.id); setAksi(null); toast('info', 'Anda keluar dari kelompok', detail.nama); onLeft(); }} />
      )}
      {aksi?.jenis === 'kode' && (
        <Konfirmasi judul="Buat kode gabung baru?" tombol="Buat kode baru" bahaya={false} onClose={tutup}
          pesan="Kode lama tidak berlaku lagi. Anggota yang sudah bergabung tidak terpengaruh."
          onConfirm={async () => { const baru = await groupService.regenerateCode(detail.id); setKode(baru); setAksi(null); toast('success', 'Kode gabung diperbarui', baru); }} />
      )}
    </Card>
  );
}

/* ---------- dokumentasi ---------- */
const MAX_FOTO = 10;

function FormDokumentasi({ grupId, onClose, onSaved }) {
  const [form, setForm] = useState({ judul: '', tanggal: '', lokasi: '', video: '', narasi: '', foto: [] });
  const [errors, setErrors] = useState({});
  const simpan = useMutation((f) => contentService.createDocumentation(grupId, f));
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  function tambahFoto(list) {
    const valid = Array.from(list).filter((f) => ['image/jpeg', 'image/png'].includes(f.type) && f.size <= 5 * 1024 * 1024);
    if (valid.length < list.length) setErrors((e) => ({ ...e, foto: 'Sebagian berkas dilewati: hanya JPG/PNG maksimal 5 MB.' }));
    setForm((f) => ({ ...f, foto: [...f.foto, ...valid.map((file) => ({ file, ket: '' }))].slice(0, MAX_FOTO) }));
  }

  async function submit(e) {
    e.preventDefault();
    const v = {};
    if (!form.judul.trim()) v.judul = 'Judul wajib diisi.';
    if (form.video.trim() && !/^https?:\/\//.test(form.video.trim())) v.video = 'Tautan harus diawali http:// atau https://';
    if (form.foto.length === 0) v.foto = 'Unggah minimal satu foto.';
    setErrors(v);
    if (Object.keys(v).length) return;
    try { await simpan.mutate(form); onSaved(); } catch { /* ditampilkan di bawah */ }
  }

  return (
    <Modal title="Tambah dokumentasi kegiatan" wide onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="grid gap-x-4.5 sm:grid-cols-2">
          <Field label="Judul kegiatan" error={errors.judul} full><input className="input-base" maxLength={255} value={form.judul} onChange={(e) => set('judul', e.target.value)} /></Field>
          <Field label="Tanggal kegiatan"><input className="input-base" type="date" value={form.tanggal} onChange={(e) => set('tanggal', e.target.value)} /></Field>
          <Field label="Lokasi"><input className="input-base" maxLength={255} value={form.lokasi} onChange={(e) => set('lokasi', e.target.value)} placeholder="Contoh: Kec. Sukasada" /></Field>
          <Field label="Tautan video YouTube (opsional)" error={errors.video} full><input className="input-base" value={form.video} onChange={(e) => set('video', e.target.value)} placeholder="https://youtu.be/…" /></Field>
          <Field label="Narasi pelaksanaan" full><textarea className="input-base min-h-[100px]" value={form.narasi} onChange={(e) => set('narasi', e.target.value)} /></Field>
          <div className="mb-4 sm:col-span-2">
            <span className="mb-1.5 block text-[.84rem] font-semibold text-ink">Foto (JPG/PNG, maks. 5 MB, maks. {MAX_FOTO})</span>
            <input type="file" accept="image/jpeg,image/png" multiple className="input-base" onChange={(e) => { tambahFoto(e.target.files); e.target.value = ''; }} />
            {form.foto.length > 0 && (
              <ul className="m-0 mt-2.5 flex list-none flex-col gap-2 p-0">
                {form.foto.map((f, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-line p-2 text-[.82rem]">
                    <span className="min-w-[140px] flex-1 truncate font-semibold text-ink">{f.file.name}</span>
                    <input className="input-base flex-[2] py-1.5" placeholder="Keterangan foto" value={f.ket}
                      onChange={(e) => setForm((s) => ({ ...s, foto: s.foto.map((x, j) => (j === i ? { ...x, ket: e.target.value } : x)) }))} />
                    <button type="button" aria-label={`Hapus ${f.file.name}`} onClick={() => setForm((s) => ({ ...s, foto: s.foto.filter((_, j) => j !== i) }))}
                      className="rounded-md p-1.5 text-ink-3 hover:bg-danger-bg hover:text-danger"><Icon name="trash" size={15} /></button>
                  </li>
                ))}
              </ul>
            )}
            {errors.foto && <span className="mt-1.5 block text-[.78rem] font-semibold text-danger">{errors.foto}</span>}
          </div>
        </div>
        {simpan.error && <p role="alert" className="mb-3 text-[.84rem] font-semibold text-danger">{errorMessage(simpan.error)}</p>}
        <div className="flex flex-wrap justify-end gap-2.5 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-2 hover:bg-surface-1">Batal</button>
          <button type="submit" disabled={simpan.loading} className="rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
            {simpan.loading ? 'Mengunggah…' : 'Simpan dokumentasi'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Luaran({ detail }) {
  const toast = useToast();
  const { data, loading, error, reload } = useGroupDeliverables(detail.id);
  const [form, setForm] = useState({ judul: '', deskripsi: '', bukti: 'checkbox' });
  const [tambah, setTambah] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [hapus, setHapus] = useState(null);
  const tutupHapus = useCallback(() => setHapus(null), []);
  const simpan = useMutation((f) => groupService.addDeliverable(detail.id, f));
  const daftar = data?.daftar || [];
  const progres = data?.progres || { total: 0, selesai: 0, persen: 0 };

  async function aksi(id, fn, pesan) {
    setBusyId(id);
    try {
      await fn();
      toast('success', pesan);
      reload();
    } catch (err) {
      toast('danger', 'Gagal memperbarui luaran', errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.judul.trim()) return;
    try {
      await simpan.mutate(form);
      toast('success', 'Luaran ditambahkan', form.judul);
      setForm({ judul: '', deskripsi: '', bukti: 'checkbox' });
      setTambah(false);
      reload();
    } catch { /* galat ditampilkan di form */ }
  }

  return (
    <Card title="Luaran riset" desc="Target luaran tim beserta bukti penyelesaiannya."
      action={(
        <button type="button" onClick={() => setTambah((v) => !v)} className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600">
          <Icon name="plus" size={15} /> {tambah ? 'Tutup' : 'Tambah'}
        </button>
      )}>
      {progres.total > 0 && (
        <div className="mb-4">
          <div className="mb-1.5 flex justify-between text-[.8rem]">
            <span className="font-semibold text-ink-2">{progres.selesai} dari {progres.total} luaran selesai</span>
            <span className="font-bold tabular-nums text-maroon-800">{progres.persen}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Progres luaran riset" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progres.persen}>
            <div className="h-full rounded-full bg-maroon-800" style={{ width: `${progres.persen}%` }} />
          </div>
        </div>
      )}

      {tambah && (
        <form onSubmit={submit} className="mb-4 grid gap-3 rounded-lg border border-line bg-surface-1 p-4 sm:grid-cols-[minmax(0,1fr)_170px]">
          <input className="input-base" required value={form.judul} onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))} placeholder="Contoh: Artikel jurnal SINTA 2" aria-label="Judul luaran" />
          <select className="input-base" value={form.bukti} onChange={(e) => setForm((f) => ({ ...f, bukti: e.target.value }))} aria-label="Jenis bukti">
            <option value="checkbox">Cukup dicentang</option>
            <option value="file">Wajib unggah berkas</option>
          </select>
          <textarea className="input-base min-h-[64px] sm:col-span-2" value={form.deskripsi} onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} placeholder="Keterangan (opsional)" aria-label="Keterangan luaran" />
          {simpan.error && <p role="alert" className="m-0 text-[.8rem] font-semibold text-danger sm:col-span-2">{errorMessage(simpan.error)}</p>}
          <button type="submit" disabled={simpan.loading} className="w-fit rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600 disabled:opacity-50">
            {simpan.loading ? 'Menyimpan…' : 'Simpan luaran'}
          </button>
        </form>
      )}

      <AsyncState loading={loading} error={error} isEmpty={daftar.length === 0} onRetry={reload}
        skeleton={<SkeletonGrid count={2} className="flex flex-col gap-2" itemClassName="h-14" />}
        empty={<EmptyState icon="doc" title="Belum ada target luaran" text="Tambahkan luaran yang dijanjikan, misalnya jurnal, purwarupa, atau policy brief." />}>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {daftar.map((d) => (
            <li key={d.id} className={`flex flex-wrap items-start gap-3 rounded-lg border p-3 ${d.selesai ? 'border-success-bg bg-success-bg/40' : 'border-line'}`}>
              <Icon name={d.selesai ? 'checkCircle' : 'clock'} size={18} className={`mt-0.5 flex-none ${d.selesai ? 'text-success' : 'text-ink-3'}`} />
              <span className="min-w-0 flex-1 text-[.84rem]">
                <span className="block font-semibold text-ink">{d.judul}</span>
                {d.deskripsi && <span className="block text-[.78rem] text-ink-2">{d.deskripsi}</span>}
                <span className="block text-[.74rem] text-ink-3">
                  {d.bukti === 'file' ? 'Bukti berkas' : 'Bukti centang'}
                  {d.selesai && d.selesaiPada ? ` · selesai ${tanggal(d.selesaiPada, true)}${d.selesaiOleh ? ` oleh ${d.selesaiOleh}` : ''}` : ''}
                </span>
                {d.fileUrl && <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[.76rem] font-semibold text-info hover:underline"><Icon name="doc" size={13} />{d.fileName}</a>}
              </span>
              <span className="flex flex-none flex-wrap items-center gap-1.5">
                {d.selesai ? (
                  <button type="button" disabled={busyId === d.id} onClick={() => aksi(d.id, () => groupService.markDeliverablePending(detail.id, d.id), 'Luaran dibuka kembali')}
                    className="rounded-lg border border-line-strong px-2.5 py-1 text-[.74rem] font-semibold text-ink-2 hover:bg-surface-1 disabled:opacity-50">Buka lagi</button>
                ) : d.bukti === 'file' ? (
                  <label className={`cursor-pointer rounded-lg bg-success px-2.5 py-1 text-[.74rem] font-semibold text-white hover:opacity-90 ${busyId === d.id ? 'pointer-events-none opacity-50' : ''}`}>
                    {busyId === d.id ? 'Mengunggah…' : 'Unggah & selesai'}
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                      onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) aksi(d.id, () => groupService.markDeliverableDone(detail.id, d.id, f), 'Luaran ditandai selesai'); }} />
                  </label>
                ) : (
                  <button type="button" disabled={busyId === d.id} onClick={() => aksi(d.id, () => groupService.markDeliverableDone(detail.id, d.id), 'Luaran ditandai selesai')}
                    className="rounded-lg bg-success px-2.5 py-1 text-[.74rem] font-semibold text-white hover:opacity-90 disabled:opacity-50">Tandai selesai</button>
                )}
                <button type="button" aria-label={`Hapus luaran ${d.judul}`} onClick={() => setHapus(d)}
                  className="rounded-md p-1.5 text-ink-3 hover:bg-danger-bg hover:text-danger"><Icon name="trash" size={15} /></button>
              </span>
            </li>
          ))}
        </ul>
      </AsyncState>

      {hapus && (
        <Konfirmasi judul="Hapus luaran" pesan={`Hapus luaran "${hapus.judul}"?`} tombol="Hapus" onClose={tutupHapus}
          onConfirm={async () => { await groupService.deleteDeliverable(detail.id, hapus.id); setHapus(null); toast('info', 'Luaran dihapus', hapus.judul); reload(); }} />
      )}
    </Card>
  );
}

function Dokumentasi({ detail }) {
  const toast = useToast();
  const { data, loading, error, reload } = useGroupDocumentations(detail.id);
  const [tambah, setTambah] = useState(false);
  const [hapus, setHapus] = useState(null);
  const tutupTambah = useCallback(() => setTambah(false), []);
  const tutupHapus = useCallback(() => setHapus(null), []);
  const bolehUbah = ['leader', 'member', 'admin'].includes(detail.peranSaya);
  const list = data || [];

  return (
    <Card title="Dokumentasi kegiatan" desc="Foto dan catatan pelaksanaan riset. Dokumentasi tampil di Galeri Kegiatan publik."
      action={bolehUbah && (
        <button type="button" onClick={() => setTambah(true)} className="flex items-center gap-1.5 rounded-lg bg-maroon-800 px-4 py-2 text-[.82rem] font-semibold text-white hover:bg-maroon-600">
          <Icon name="plus" size={15} /> Tambah
        </button>
      )}>
      <AsyncState loading={loading} error={error} isEmpty={list.length === 0} onRetry={reload}
        skeleton={<SkeletonGrid count={2} className="flex flex-col gap-2" itemClassName="h-20" />}
        empty={<EmptyState icon="camera" title="Belum ada dokumentasi" text={bolehUbah ? 'Unggah foto kegiatan lapangan pertama tim Anda.' : undefined} />}>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {list.map((d, i) => (
            <li key={d.id} className="flex gap-3 rounded-lg border border-line p-3">
              <SmartImage src={d.foto[0]?.src} alt={d.foto[0]?.ket || d.judul} seed={i} className="h-16 w-24 flex-none rounded-md" />
              <span className="min-w-0 flex-1 text-[.84rem]">
                <span className="block font-semibold text-ink">{d.judul}</span>
                <span className="block text-[.76rem] text-ink-3">{tanggal(d.tanggal)} · {d.foto.length} foto{d.penulis ? ` · oleh ${d.penulis}` : ''}</span>
                <span className="mt-1 block text-[.8rem] text-ink-2 line-clamp-2">{d.narasi}</span>
              </span>
              {bolehUbah && (
                <button type="button" onClick={() => setHapus(d)} aria-label={`Hapus ${d.judul}`}
                  className="self-start rounded-md p-1.5 text-ink-3 hover:bg-danger-bg hover:text-danger"><Icon name="trash" size={15} /></button>
              )}
            </li>
          ))}
        </ul>
      </AsyncState>

      {tambah && <FormDokumentasi grupId={detail.id} onClose={tutupTambah} onSaved={() => { setTambah(false); toast('success', 'Dokumentasi ditambahkan', 'Tampil di galeri kegiatan.'); reload(); }} />}
      {hapus && (
        <Konfirmasi judul="Hapus dokumentasi?" tombol="Ya, hapus" onClose={tutupHapus} pesan={`"${hapus.judul}" akan dihapus.`}
          onConfirm={async () => { await contentService.deleteDocumentation(detail.id, hapus.id); setHapus(null); toast('info', 'Dokumentasi dihapus', hapus.judul); reload(); }} />
      )}
    </Card>
  );
}

/* ---------- detail kelompok ---------- */
function DetailKelompok({ id, admin, onBack }) {
  const toast = useToast();
  const { data: d, loading, error, reload } = useGroupDetail(id, { admin });
  const [edit, setEdit] = useState(false);
  const tutupEdit = useCallback(() => setEdit(false), []);

  if (!d) {
    return (
      <div className="flex flex-col gap-4">
        <button type="button" onClick={onBack} className="self-start text-[.84rem] font-semibold text-maroon-800 hover:underline">← Kembali ke daftar kelompok</button>
        {error ? <ErrorState error={error} onRetry={reload} title="Kelompok gagal dimuat" /> : <SkeletonGrid count={3} className="flex flex-col gap-4" itemClassName="h-32" />}
      </div>
    );
  }

  const r = d.riset;
  const ketua = d.peranSaya === 'leader';
  const segarkan = () => reload();

  return (
    <div className={`flex flex-col gap-4 sm:gap-5 ${loading ? 'opacity-80' : ''}`}>
      <button type="button" onClick={onBack} className="self-start text-[.84rem] font-semibold text-maroon-800 hover:underline">← Kembali ke daftar kelompok</button>

      <section className="rounded-xl border border-line bg-white p-4 sm:p-5.5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <RoleBadge role={d.peranSaya} />
          {r && <StatusBadge status={r.status} />}
          {r && <span className="text-[.78rem] font-semibold tabular-nums text-ink-3">{r.kode}</span>}
        </div>
        <h2 className="mb-1 text-[1.2rem] leading-snug">{r?.judul || d.nama}</h2>
        <p className="m-0 text-[.84rem] text-ink-3">{[r?.bidang, r?.lokasi && `Kec. ${r.lokasi}`, r?.periode].filter(Boolean).join(' · ')}</p>
        {r && ['on-going', 'approved'].includes(r.status) && (
          <Link to={`/riset/${r.slug}`} className="mt-3 inline-flex items-center gap-1.5 text-[.82rem] font-semibold text-maroon-800 no-underline hover:underline">
            Lihat halaman publik riset <Icon name="external" size={13} />
          </Link>
        )}
      </section>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-4 sm:gap-5">
          {r && (
            <Card title="Informasi riset" desc={ketua ? 'Hanya Anda sebagai ketua peneliti yang dapat mengubah informasi ini.' : 'Hanya ketua peneliti yang dapat mengubah informasi ini.'}
              action={ketua && (
                <button type="button" onClick={() => setEdit(true)} className="flex items-center gap-1.5 rounded-lg border border-line-strong px-4 py-2 text-[.82rem] font-semibold text-maroon-800 hover:border-maroon-800 hover:bg-maroon-50">
                  Edit riset
                </button>
              )}>
              <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.75 text-[.845rem]">
                <dt className="font-semibold text-ink-3">Skema</dt><dd className="m-0 font-semibold">{r.skema || '-'}</dd>
                <dt className="font-semibold text-ink-3">Anggaran</dt><dd className="m-0 font-semibold">{r.dana ? rupiah(r.dana) : '-'}</dd>
                <dt className="font-semibold text-ink-3">Sasaran RPJMD</dt><dd className="m-0 font-semibold">{r.rpjmd || '-'}</dd>
                <dt className="font-semibold text-ink-3">Lokasi</dt><dd className="m-0 font-semibold">{r.alamat || r.lokasi || '-'}</dd>
                <dt className="font-semibold text-ink-3">Mitra</dt><dd className="m-0 font-semibold">{[r.targetMitra, r.mitra].filter(Boolean).join(' · ') || '-'}</dd>
                <dt className="font-semibold text-ink-3">Penerima manfaat</dt><dd className="m-0 font-semibold">{r.penerimaManfaat || '-'}</dd>
                {r.berkas && <><dt className="font-semibold text-ink-3">Proposal</dt><dd className="m-0 font-semibold"><a href={r.berkas} target="_blank" rel="noopener noreferrer" className="text-maroon-800 underline">Buka PDF</a></dd></>}
              </dl>
              <h4 className="mb-1.5 text-[.9rem]">Urgensi &amp; tujuan</h4>
              <p className="mb-4 whitespace-pre-line text-[.85rem] text-ink-2">{r.tujuan || '-'}</p>
              {r.signifikansi && <><h4 className="mb-1.5 text-[.9rem]">Signifikansi</h4><p className="mb-4 whitespace-pre-line text-[.85rem] text-ink-2">{r.signifikansi}</p></>}
              <h4 className="mb-1.5 text-[.9rem]">Luaran</h4>
              <p className="m-0 whitespace-pre-line text-[.85rem] text-ink-2">{r.luaran || '-'}</p>
            </Card>
          )}
          <Luaran detail={d} />
          <Dokumentasi detail={d} />
        </div>
        <div className="flex flex-col gap-4 sm:gap-5">
          <Pembimbing detail={d} onChanged={segarkan} />
          <Anggota key={d.kodeGabung} detail={d} onChanged={segarkan} onLeft={onBack} />
        </div>
      </div>

      {edit && r && (
        <EditRiset grupId={d.id} riset={r} onClose={tutupEdit}
          onSaved={() => { setEdit(false); segarkan(); toast('success', 'Riset diperbarui', 'Perubahan tersimpan.'); }} />
      )}
    </div>
  );
}

/**
 * Halaman kelompok riset. bolehGabung: tampilkan form gabung dengan kode (akun peneliti).
 */
export default function KelompokRiset({ admin = false, bolehGabung = false, judulKosong = 'Belum ada kelompok riset' }) {
  const [aktif, setAktif] = useState(null);
  if (aktif) return <DetailKelompok key={aktif} id={aktif} admin={admin} onBack={() => setAktif(null)} />;
  return <DaftarKelompok admin={admin} bolehGabung={bolehGabung} judulKosong={judulKosong} onOpen={setAktif} />;
}
