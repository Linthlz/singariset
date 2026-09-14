/* ==========================================================================
   SINGA RISET BULELENG — Data Layer (mock dataset, front-end only)
   Semua angka bersifat contoh untuk keperluan prototipe portal BRIDA Buleleng.
   ========================================================================== */

/* Kolom `potensi`, `isu`, dan `peluang` adalah materi navigasi wilayah pada
   peta sebaran (lihat KecamatanMap.jsx) — disusun dari karakteristik umum
   tiap kecamatan sebagai konteks awal eksplorasi, bukan klaim hasil riset. */
export const KECAMATAN = [
  {
    id: 'gerokgak', nama: 'Gerokgak', desa: 14, riset: 18, fokus: 'Kelautan & Garam',
    deskripsi: 'Kecamatan pesisir barat dengan garis pantai terpanjang, kawasan konservasi laut, dan lahan kering di sisi selatan.',
    potensi: ['🌊 Kelautan & Konservasi Karang', '🧂 Garam Tradisional', '🐐 Peternakan Lahan Kering', '🏭 Industri & Pelabuhan'],
    isu: ['Kekeringan dan minimnya irigasi di lahan pertanian kering', 'Abrasi pantai dan tekanan terhadap terumbu karang', 'Akses jalan desa pesisir yang masih terbatas', 'Pengelolaan dampak lingkungan kawasan industri & pelabuhan'],
    peluang: [
      { judul: 'Smart Irrigation Lahan Kering', deskripsi: 'Irigasi tetes hemat air berbasis sensor kelembapan untuk lahan pertanian kering Gerokgak.' },
      { judul: 'Konservasi Karang Berbasis Masyarakat', deskripsi: 'Pemantauan terumbu karang Pemuteran melibatkan kelompok nelayan dan pokdarwis setempat.' }
    ]
  },
  {
    id: 'seririt', nama: 'Seririt', desa: 21, riset: 15, fokus: 'Pertanian & Hortikultura',
    deskripsi: 'Pusat perdagangan Buleleng Barat dengan lahan hortikultura luas dan pasar tradisional yang menjadi simpul distribusi hasil bumi.',
    potensi: ['🥭 Hortikultura (Mangga & Anggur)', '🌽 Pertanian Lahan Kering', '🏪 Pasar & Perdagangan', '💧 Sumber Daya Air'],
    isu: ['Keterbatasan pengairan pada musim kemarau panjang', 'Fluktuasi harga hasil panen di tingkat petani', 'Distribusi pascapanen ke pasar yang belum efisien'],
    peluang: [
      { judul: 'Digitalisasi Rantai Pasok Hortikultura', deskripsi: 'Platform penghubung petani-pasar untuk memangkas rantai distribusi mangga dan anggur.' },
      { judul: 'Sistem Prediksi Cuaca & Musim Tanam', deskripsi: 'Rekomendasi waktu tanam berbasis data cuaca lokal untuk petani lahan kering.' }
    ]
  },
  {
    id: 'busungbiu', nama: 'Busungbiu', desa: 15, riset: 9, fokus: 'Kopi & Agroforestri',
    deskripsi: 'Dataran tinggi penghasil kopi robusta dan buah musiman dengan pola tani agroforestri di lereng perbukitan.',
    potensi: ['☕ Kopi Robusta', '🌳 Agroforestri', '🍈 Durian & Buah Musiman', '👩‍🌾 Kelompok Tani'],
    isu: ['Mutu pascapanen kopi yang belum merata antar kelompok tani', 'Akses jalan menuju kebun di kawasan perbukitan', 'Regenerasi petani muda yang melambat'],
    peluang: [
      { judul: 'Digitalisasi Mutu & Sertifikasi Kopi', deskripsi: 'Standardisasi pascapanen dan penelusuran asal kopi robusta Busungbiu untuk akses pasar lebih luas.' },
      { judul: 'Ekowisata Kebun Kopi Berbasis Komunitas', deskripsi: 'Paket wisata edukasi kebun kopi yang dikelola langsung oleh kelompok tani setempat.' }
    ]
  },
  {
    id: 'banjar', nama: 'Banjar', desa: 17, riset: 22, fokus: 'Pariwisata & Heritage',
    deskripsi: 'Kawasan wisata bahari Lovina, pemandian air panas, dan situs budaya-religi yang menjadi tujuan kunjungan utama Bali Utara.',
    potensi: ['🏝 Pariwisata Bahari Lovina', '♨️ Wisata Air Panas', '🛕 Situs Budaya & Religi', '🐬 Konservasi Lumba-lumba'],
    isu: ['Tekanan lingkungan akibat volume kunjungan wisata', 'Standar mutu dan keselamatan operator wisata bahari', 'Pemerataan manfaat ekonomi pariwisata ke masyarakat lokal'],
    peluang: [
      { judul: 'Sistem Kuota & Zonasi Wisata Bahari Digital', deskripsi: 'Pengaturan kuota perahu dan zonasi kawasan dolphin watching berbasis aplikasi.' },
      { judul: 'Paket Wisata Terintegrasi Desa Adat', deskripsi: 'Menghubungkan wisata bahari dengan desa adat sekitar agar manfaat ekonomi lebih merata.' }
    ]
  },
  {
    id: 'sukasada', nama: 'Sukasada', desa: 15, riset: 24, fokus: 'Air, Konservasi & Pendidikan',
    deskripsi: 'Kawasan hulu berbukit dengan banyak air terjun dan hutan lindung, sekaligus pusat pendidikan tinggi Buleleng.',
    potensi: ['💧 Air Terjun & Ekowisata', '🎓 Pusat Pendidikan Tinggi', '🌲 Konservasi Hutan', '🚴 Wisata Petualangan'],
    isu: ['Menjaga daya dukung lingkungan kawasan wisata alam', 'Sinergi riset kampus dengan kebutuhan nyata desa', 'Mitigasi risiko longsor di kawasan berbukit'],
    peluang: [
      { judul: 'Early Warning System Longsor Berbasis Komunitas', deskripsi: 'Sistem peringatan dini kolaborasi kampus dan desa untuk kawasan rawan longsor.' },
      { judul: 'Platform Riset Kolaboratif Kampus-Desa', deskripsi: 'Menjodohkan topik tugas akhir/riset kampus dengan kebutuhan nyata desa binaan.' }
    ]
  },
  {
    id: 'buleleng', nama: 'Buleleng', desa: 29, riset: 41, fokus: 'Smart City & Layanan Publik',
    deskripsi: 'Ibu kota kabupaten dan pusat pemerintahan, pendidikan, serta layanan publik dengan kepadatan aktivitas tertinggi.',
    potensi: ['🏙 Pusat Pemerintahan & Layanan', '🎓 Pendidikan & UMKM Kota', '🚦 Infrastruktur Perkotaan', '📶 Digitalisasi Layanan'],
    isu: ['Kemacetan dan tata ruang kawasan perkotaan', 'Layanan publik digital yang belum merata di semua kelurahan', 'Pengelolaan sampah dan kebersihan perkotaan'],
    peluang: [
      { judul: 'Satu Data & Layanan Publik Terpadu', deskripsi: 'Integrasi layanan OPD dalam satu portal agar warga tidak berpindah-pindah kanal.' },
      { judul: 'Smart Waste Management Kota Singaraja', deskripsi: 'Optimalisasi rute dan jadwal angkut sampah berbasis data volume per kelurahan.' }
    ]
  },
  {
    id: 'sawan', nama: 'Sawan', desa: 14, riset: 13, fokus: 'Padi & Kerajinan',
    deskripsi: 'Sentra sawah subak dan kerajinan gamelan turun-temurun yang menjadi identitas budaya kecamatan.',
    potensi: ['🌾 Padi & Subak', '🔔 Kerajinan Gamelan', '🧵 Industri Kreatif Rumahan', '🐄 Peternakan Rakyat'],
    isu: ['Regenerasi perajin gamelan yang melambat', 'Efisiensi irigasi pada sistem subak', 'Akses pasar yang terbatas bagi produk kerajinan'],
    peluang: [
      { judul: 'Digitalisasi Pemasaran Kerajinan Gamelan', deskripsi: 'Katalog dan pemasaran daring produk perajin gamelan Sawan ke pasar nasional.' },
      { judul: 'Optimalisasi Irigasi Subak Berbasis Sensor', deskripsi: 'Pemantauan debit air subak untuk pembagian irigasi yang lebih adil dan efisien.' }
    ]
  },
  {
    id: 'kubutambahan', nama: 'Kubutambahan', desa: 13, riset: 11, fokus: 'EBT & Infrastruktur',
    deskripsi: 'Kawasan pesisir timur dengan rencana pengembangan infrastruktur strategis dan cagar budaya Pura Beji.',
    potensi: ['⚡ Energi Baru Terbarukan', '🛣 Infrastruktur Strategis', '🛕 Cagar Budaya Pura Beji', '🌾 Pertanian Pesisir'],
    isu: ['Kesiapan tata ruang menghadapi rencana infrastruktur besar', 'Pelestarian cagar budaya di tengah tekanan pembangunan', 'Akses energi listrik di desa-desa terpencil'],
    peluang: [
      { judul: 'Kajian Dampak Sosial-Lingkungan Infrastruktur', deskripsi: 'Riset dampak proyek infrastruktur strategis terhadap tata ruang dan sosial masyarakat.' },
      { judul: 'Pilot Energi Surya Komunal Desa Pesisir', deskripsi: 'Uji coba panel surya komunal untuk desa pesisir dengan akses listrik terbatas.' }
    ]
  },
  {
    id: 'tejakula', nama: 'Tejakula', desa: 10, riset: 16, fokus: 'Perikanan & Desa Adat',
    deskripsi: 'Kecamatan ujung timur dengan tradisi desa adat Bali Aga tertua dan aktivitas perikanan tangkap serta budi daya rumput laut.',
    potensi: ['🐟 Perikanan Tangkap', '🌿 Budi Daya Rumput Laut', '🏘 Desa Adat Bali Aga', '🧂 Garam Pesisir'],
    isu: ['Fluktuasi hasil tangkap akibat cuaca ekstrem', 'Pelestarian tradisi desa adat kuno di tengah modernisasi', 'Akses cold storage dan pengolahan pascapanen perikanan'],
    peluang: [
      { judul: 'Cold Storage Komunal Nelayan', deskripsi: 'Fasilitas penyimpanan dingin bersama untuk menjaga mutu dan nilai jual hasil tangkap.' },
      { judul: 'Dokumentasi Digital Warisan Desa Bali Aga', deskripsi: 'Pengarsipan digital tradisi dan tata desa adat Sembiran-Julah sebagai riset sosial-budaya.' }
    ]
  }
];

export const BIDANG = [
  { id: 'pertanian',  nama: 'Pertanian & Ketahanan Pangan', pct: 38, warna: '#15803D' },
  { id: 'pariwisata', nama: 'Pariwisata & Ekonomi Kreatif', pct: 22, warna: '#C62828' },
  { id: 'smartcity',  nama: 'Smart City & Tata Kelola',     pct: 18, warna: '#1D4ED8' },
  { id: 'kelautan',   nama: 'Kelautan & Perikanan',         pct: 15, warna: '#0E7490' },
  { id: 'sosial',     nama: 'Pendidikan & Sosial Budaya',   pct: 7,  warna: '#F9C74F' }
];

export const SKEMA = [
  { id: 'hibah-daerah', nama: 'Hibah Riset Daerah BRIDA' },
  { id: 'insentif',     nama: 'Insentif Riset Terapan' },
  { id: 'kolaboratif',  nama: 'Riset Kolaboratif Pentahelix' },
  { id: 'mandiri',      nama: 'Riset Mandiri Perguruan Tinggi' },
  { id: 'brin',         nama: 'Kemitraan BRIN / Nasional' }
];

export const INSTITUSI = [
  { abbr: 'UNDIKSHA', nama: 'Universitas Pendidikan Ganesha', tipe: 'Perguruan Tinggi' },
  { abbr: 'UNUD',     nama: 'Universitas Udayana',            tipe: 'Perguruan Tinggi' },
  { abbr: 'PNB',      nama: 'Politeknik Negeri Bali',         tipe: 'Perguruan Tinggi' },
  { abbr: 'STIKOM',   nama: 'ITB STIKOM Bali',                tipe: 'Perguruan Tinggi' },
  { abbr: 'BRIN',     nama: 'Badan Riset dan Inovasi Nasional', tipe: 'Lembaga Litbang' },
  { abbr: 'BRIDA',    nama: 'BRIDA Kabupaten Buleleng',       tipe: 'Pemerintah Daerah' },
  { abbr: 'BAPPEDA',  nama: 'Bappeda Litbang Buleleng',       tipe: 'Pemerintah Daerah' },
  { abbr: 'UNIPAS',   nama: 'Universitas Panji Sakti',        tipe: 'Perguruan Tinggi' },
  { abbr: 'POLTEKES', nama: 'Poltekkes Kemenkes Denpasar',    tipe: 'Perguruan Tinggi' },
  { abbr: 'DISTAN',   nama: 'Dinas Pertanian Buleleng',       tipe: 'OPD Mitra' },
  { abbr: 'DISPAR',   nama: 'Dinas Pariwisata Buleleng',      tipe: 'OPD Mitra' },
  { abbr: 'DKP',      nama: 'Dinas Kelautan & Perikanan',     tipe: 'OPD Mitra' }
];

export const MITRA_SASARAN = [
  { id: 'opd',        nama: 'Dinas / OPD Teknis',        sub: 'Bappeda, Distan, Dispar, DKP, Diskominfo' },
  { id: 'subak',      nama: 'Komunitas Subak',           sub: 'Subak sawah, subak abian, krama pengempon' },
  { id: 'pokdarwis',  nama: 'Kelompok Sadar Wisata',     sub: 'Pokdarwis desa wisata & pengelola DTW' },
  { id: 'umkm',       nama: 'UMKM & Industri Lokal',     sub: 'Koperasi, IKM olahan, ekonomi kreatif' },
  { id: 'desa-adat',  nama: 'Desa Adat / Desa Dinas',    sub: 'Prajuru adat, perbekel, BUMDes' },
  { id: 'sekolah',    nama: 'Satuan Pendidikan',         sub: 'SD/SMP/SMA, PKBM, komunitas literasi' }
];

export const RISET = [
  {
    id: 'BRD-2025-001',
    judul: 'Sistem Irigasi Presisi Berbasis IoT untuk Subak Sawah Sukasada Menghadapi Anomali Iklim',
    peneliti: 'Prof. Dr. I Gede Suarnaya, M.T.',
    institusi: 'UNDIKSHA', nidn: '0012057803',
    tim: ['Dr. Ni Luh Pastini, S.Kom., M.Cs.', 'I Kadek Arya Wijaya, M.T.', 'Ir. Made Rai Sudarma'],
    bidang: 'pertanian', kecamatan: 'sukasada', tahun: 2025, skema: 'hibah-daerah',
    status: 'ontrack', progress: 68, tahap: 5,
    anggaran: 285000000, terserap: 193800000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Subak Padanggalak', 'Dinas Pertanian Buleleng'],
    kontrak: 'SPK-027/BRIDA-BLL/III/2025', mulai: '2025-03-14', selesai: '2025-11-28',
    abstrak: 'Riset ini mengembangkan sistem irigasi presisi berbasis sensor kelembapan tanah dan aktuator katup otomatis yang terintegrasi dengan pola tanam adat subak. Sistem menargetkan efisiensi air 30% tanpa mengubah struktur pembagian air awig-awig subak, sekaligus menyediakan data debit harian untuk perencanaan Dinas Pertanian.',
    metodologi: 'Research and Development (R&D) model ADDIE dengan uji lapangan pada 3 tempek subak; pengukuran debit menggunakan flow meter ultrasonik; analisis efisiensi dengan uji-t berpasangan pada dua musim tanam.',
    luaran: ['Purwarupa 12 node IoT terpasang', 'Jurnal SINTA 2', 'Policy Brief pola tanam adaptif', 'Paten sederhana katup adaptif'],
    dampak: '3 tempek subak (128 ha) dengan penghematan air rerata 27% pada MT-1 2025.',
    tags: ['IoT', 'Subak', 'Irigasi', 'Adaptasi Iklim'], adopsi: true, publikasi: 2
  },
  {
    id: 'BRD-2025-002',
    judul: 'Model Pengelolaan Wisata Bahari Berkelanjutan Berbasis Masyarakat di Kawasan Lovina',
    peneliti: 'Dr. Ni Made Ayu Sriwahyuni, M.Par.',
    institusi: 'UNUD', nidn: '0021128105',
    tim: ['Dr. I Wayan Restu, M.Si.', 'Kadek Dwi Lestari, M.Par.'],
    bidang: 'pariwisata', kecamatan: 'banjar', tahun: 2025, skema: 'kolaboratif',
    status: 'ontrack', progress: 74, tahap: 5,
    anggaran: 240000000, terserap: 177600000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Pokdarwis Kalibukbuk', 'Dinas Pariwisata Buleleng', 'Desa Adat Kaliasem'],
    kontrak: 'SPK-031/BRIDA-BLL/III/2025', mulai: '2025-03-20', selesai: '2025-12-05',
    abstrak: 'Kajian merumuskan standar operasional atraksi dolphin watching yang etis dan terukur, mencakup zonasi jarak aman, kuota perahu per sesi, serta skema bagi hasil komunitas. Riset menghasilkan instrumen sertifikasi operator lokal yang siap diadopsi menjadi Perbup.',
    metodologi: 'Mixed method: observasi perilaku mamalia laut (focal follow) 90 sesi, wawancara mendalam 42 pelaku, dan analisis daya dukung kawasan (carrying capacity) Cifuentes.',
    luaran: ['Draf Perbup standar wisata bahari', 'Modul sertifikasi operator', 'Jurnal terakreditasi SINTA 2'],
    dampak: '86 operator perahu dan 4 kelompok Pokdarwis di kawasan Lovina.',
    tags: ['Lovina', 'Wisata Bahari', 'Konservasi', 'Pokdarwis'], adopsi: true, publikasi: 1
  },
  {
    id: 'BRD-2025-003',
    judul: 'Hilirisasi Kopi Robusta Wanagiri: Standarisasi Pascapanen dan Penguatan Merek Kolektif',
    peneliti: 'Dr. Ir. I Putu Gede Adiatmika, M.P.',
    institusi: 'UNUD', nidn: '0008076902',
    tim: ['Ni Kadek Sri Utami, S.TP., M.Sc.', 'I Nyoman Gede Sujana, M.M.'],
    bidang: 'pertanian', kecamatan: 'sukasada', tahun: 2025, skema: 'insentif',
    status: 'warning', progress: 46, tahap: 4,
    anggaran: 175000000, terserap: 87500000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Subak Abian Wanagiri', 'Koperasi Tani Sari Gunung', 'UMKM Kopi Buleleng'],
    kontrak: 'SPK-045/BRIDA-BLL/IV/2025', mulai: '2025-04-02', selesai: '2025-12-15',
    abstrak: 'Riset menyusun protokol fermentasi dan pengeringan kopi robusta dataran tinggi Wanagiri untuk menaikkan nilai cupping score di atas 80, disertai penyusunan identitas merek kolektif dan skema indikasi geografis bagi petani subak abian.',
    metodologi: 'Eksperimen faktorial 3x3 (metode fermentasi × durasi pengeringan), uji organoleptik panelis tersertifikasi Q-Grader, serta analisis nilai tambah metode Hayami.',
    luaran: ['SOP pascapanen kopi robusta', 'Dokumen pengajuan Indikasi Geografis', 'Purwarupa kemasan merek kolektif'],
    dampak: '210 petani kopi di Desa Wanagiri dan Pancasari.',
    tags: ['Kopi Robusta', 'Hilirisasi', 'UMKM', 'Indikasi Geografis'], adopsi: false, publikasi: 1,
    catatanKendala: 'Uji organoleptik tertunda karena keterbatasan panelis Q-Grader bersertifikat.'
  },
  {
    id: 'BRD-2025-004',
    judul: 'Sistem Peringatan Dini Banjir Bandang Sungai Buleleng Berbasis Sensor dan Notifikasi Desa',
    peneliti: 'I Gusti Ngurah Agung Pramana, S.T., M.Kom.',
    institusi: 'STIKOM', nidn: '0819089002',
    tim: ['Putu Adi Guna Permana, M.Kom.', 'Ni Wayan Deriani, M.M.Kom.'],
    bidang: 'smartcity', kecamatan: 'buleleng', tahun: 2025, skema: 'hibah-daerah',
    status: 'ontrack', progress: 82, tahap: 6,
    anggaran: 310000000, terserap: 254200000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['BPBD Buleleng', 'Diskominfosanti Buleleng', 'Desa Adat Banyuasri'],
    kontrak: 'SPK-019/BRIDA-BLL/II/2025', mulai: '2025-02-24', selesai: '2025-11-14',
    abstrak: 'Pengembangan jaringan sensor ketinggian muka air pada 6 titik hulu-hilir Sungai Buleleng, terhubung ke dashboard BPBD dan pengeras suara desa serta pesan siaga berbasis WhatsApp gateway untuk kelian banjar.',
    metodologi: 'Rekayasa sistem dengan pendekatan prototyping; kalibrasi sensor terhadap AWLR eksisting; uji reliabilitas notifikasi melalui simulasi 30 skenario debit.',
    luaran: ['6 stasiun sensor operasional', 'Dashboard kebencanaan BPBD', 'SOP diseminasi peringatan dini'],
    dampak: '11 banjar di bantaran Sungai Buleleng, estimasi 9.400 jiwa.',
    tags: ['Mitigasi Bencana', 'Sensor', 'Smart City', 'BPBD'], adopsi: true, publikasi: 2
  },
  {
    id: 'BRD-2025-005',
    judul: 'Restorasi Terumbu Karang Partisipatif dengan Struktur Biorock di Perairan Pemuteran',
    peneliti: 'Dr. I Wayan Gede Astawa Karang, M.Si.',
    institusi: 'UNUD', nidn: '0004017504',
    tim: ['Ni Putu Eka Damayanti, M.Si.', 'I Made Suwastika, S.Pi.'],
    bidang: 'kelautan', kecamatan: 'gerokgak', tahun: 2025, skema: 'kolaboratif',
    status: 'ontrack', progress: 61, tahap: 5,
    anggaran: 265000000, terserap: 161650000, sumber: 'APBD + Dana Padanan Mitra',
    mitra: ['Dinas Kelautan & Perikanan', 'Pecalang Segara Pemuteran', 'Pokdarwis Pemuteran'],
    kontrak: 'SPK-038/BRIDA-BLL/III/2025', mulai: '2025-03-28', selesai: '2025-12-20',
    abstrak: 'Riset mengukur laju pertumbuhan karang pada struktur biorock bertenaga surya serta merumuskan model pengelolaan berbasis awig-awig pecalang segara agar restorasi berkelanjutan secara sosial dan ekonomi.',
    metodologi: 'Eksperimen lapangan dengan 8 modul biorock, pengukuran linear extension rate bulanan, transek garis untuk tutupan karang, dan analisis kelembagaan IAD Framework.',
    luaran: ['8 modul biorock terpasang', 'Panduan restorasi partisipatif', 'Artikel jurnal internasional'],
    dampak: '1,8 ha area restorasi dan 3 kelompok nelayan pengawas.',
    tags: ['Terumbu Karang', 'Pemuteran', 'Konservasi Laut', 'Biorock'], adopsi: false, publikasi: 3
  },
  {
    id: 'BRD-2025-006',
    judul: 'Digitalisasi Arsip Lontar Gedong Kirtya sebagai Sumber Belajar Muatan Lokal Buleleng',
    peneliti: 'Dr. Ni Ketut Widiartini, S.Pd., M.Pd.',
    institusi: 'UNDIKSHA', nidn: '0027038201',
    tim: ['I Made Suarjana, S.S., M.Hum.', 'Kadek Yudiana, M.Pd.'],
    bidang: 'sosial', kecamatan: 'buleleng', tahun: 2025, skema: 'insentif',
    status: 'delayed', progress: 34, tahap: 3,
    anggaran: 145000000, terserap: 58000000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['UPTD Gedong Kirtya', 'Dinas Pendidikan Buleleng', 'MGMP Bahasa Bali'],
    kontrak: 'SPK-052/BRIDA-BLL/IV/2025', mulai: '2025-04-18', selesai: '2025-12-18',
    abstrak: 'Riset melakukan digitalisasi dan transliterasi 120 cakep lontar koleksi Gedong Kirtya menjadi bahan ajar muatan lokal digital yang terhubung dengan kurikulum SMP di Kabupaten Buleleng.',
    metodologi: 'Filologi digital: alih aksara, alih bahasa, dan penyuntingan teks; validasi ahli bahasa Bali; uji keterbacaan bahan ajar pada 6 sekolah percontohan.',
    luaran: ['Repositori digital 120 lontar', 'Modul muatan lokal digital', 'Rekomendasi kurikulum muatan lokal'],
    dampak: '6 SMP percontohan, 1.240 siswa pada uji coba tahap awal.',
    tags: ['Lontar', 'Gedong Kirtya', 'Heritage', 'Pendidikan'], adopsi: false, publikasi: 0,
    catatanKendala: 'Keterlambatan pengadaan scanner non-kontak dan proses konservasi lontar rapuh; laporan kemajuan termin II melewati batas 21 hari.'
  },
  {
    id: 'BRD-2025-007',
    judul: 'Pemanfaatan Limbah Ternak Sapi Bali menjadi Pupuk Organik Cair untuk Lahan Kering Gerokgak',
    peneliti: 'Ir. I Nyoman Suarna, M.P.',
    institusi: 'UNIPAS', nidn: '0812066501',
    tim: ['Ni Luh Gede Sudaryati, S.P., M.Si.', 'I Ketut Suardika, S.Pt.'],
    bidang: 'pertanian', kecamatan: 'gerokgak', tahun: 2024, skema: 'hibah-daerah',
    status: 'selesai', progress: 100, tahap: 7,
    anggaran: 165000000, terserap: 163900000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Simantri Gerokgak', 'Dinas Pertanian Buleleng', 'Kelompok Tani Sari Amerta'],
    kontrak: 'SPK-014/BRIDA-BLL/II/2024', mulai: '2024-02-19', selesai: '2024-11-29',
    abstrak: 'Riset menghasilkan formulasi pupuk organik cair berbahan urine sapi bali terfermentasi yang meningkatkan hasil jagung lahan kering 21% dibanding kontrol, disertai model produksi skala kelompok tani.',
    metodologi: 'Rancangan Acak Kelompok dengan 5 taraf konsentrasi dan 4 ulangan; analisis unsur hara laboratorium; uji kelayakan usaha B/C ratio.',
    luaran: ['Formula POC terstandar', 'Unit produksi kelompok tani', 'Jurnal SINTA 3', 'Rekomendasi teknis Distan'],
    dampak: 'Diadopsi 7 kelompok tani (± 340 anggota) di Gerokgak dan Seririt.',
    tags: ['Pupuk Organik', 'Sapi Bali', 'Lahan Kering', 'Simantri'], adopsi: true, publikasi: 2
  },
  {
    id: 'BRD-2025-008',
    judul: 'Rancang Bangun PLTS Atap Terintegrasi untuk Fasilitas Publik Desa di Kubutambahan',
    peneliti: 'Dr. Nyoman Santiyadnya, S.T., M.T.',
    institusi: 'UNDIKSHA', nidn: '0015097102',
    tim: ['I Wayan Sutaya, S.T., M.T.', 'Gede Indrawan, Ph.D.'],
    bidang: 'smartcity', kecamatan: 'kubutambahan', tahun: 2025, skema: 'brin',
    status: 'warning', progress: 52, tahap: 4,
    anggaran: 420000000, terserap: 218400000, sumber: 'Kemitraan BRIN + APBD',
    mitra: ['Dinas PUTR Buleleng', 'Pemerintah Desa Bungkulan', 'PLN UP3 Bali Utara'],
    kontrak: 'SPK-009/BRIDA-BLL/II/2025', mulai: '2025-02-10', selesai: '2025-12-22',
    abstrak: 'Riset merancang sistem PLTS atap on-grid berkapasitas 15 kWp untuk kantor desa, puskesmas pembantu, dan penerangan jalan, lengkap dengan model pembiayaan BUMDes dan skema pemeliharaan berbasis kader desa.',
    metodologi: 'Simulasi PVSyst untuk optimasi tilt dan orientasi, pengukuran iradiasi lapangan 6 bulan, serta analisis kelayakan finansial NPV-IRR-payback period.',
    luaran: ['Detail Engineering Design PLTS', 'Purwarupa 15 kWp terpasang', 'Model bisnis BUMDes energi'],
    dampak: '3 fasilitas publik desa, estimasi penghematan listrik Rp 41 juta/tahun.',
    tags: ['EBT', 'PLTS', 'Desa Energi', 'BUMDes'], adopsi: false, publikasi: 1,
    catatanKendala: 'Deviasi jadwal pemasangan akibat menunggu izin sambungan ekspor-impor PLN; dokumen SPJ termin II belum lengkap.'
  },
  {
    id: 'BRD-2025-009',
    judul: 'Budidaya Rumput Laut Kotoni Sistem Long-line Adaptif Gelombang di Perairan Tejakula',
    peneliti: 'Dr. I Made Dwi Ariyanta, S.Pi., M.Si.',
    institusi: 'PNB', nidn: '0003098503',
    tim: ['Ni Made Ary Purnamasari, M.Si.', 'I Ketut Wija, S.Pi.'],
    bidang: 'kelautan', kecamatan: 'tejakula', tahun: 2025, skema: 'insentif',
    status: 'ontrack', progress: 58, tahap: 5,
    anggaran: 155000000, terserap: 89900000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Kelompok Nelayan Segara Madu', 'Dinas Kelautan & Perikanan'],
    kontrak: 'SPK-041/BRIDA-BLL/IV/2025', mulai: '2025-04-07', selesai: '2025-12-08',
    abstrak: 'Riset menguji konstruksi long-line elastis yang tahan gelombang musim barat untuk budidaya Kappaphycus alvarezii, dengan target menaikkan tingkat kelulusan panen dari 54% menjadi di atas 80%.',
    metodologi: 'Eksperimen lapangan 3 desain konstruksi × 3 kedalaman, pengukuran laju pertumbuhan spesifik mingguan, serta analisis kandungan karagenan.',
    luaran: ['Desain long-line adaptif', 'Panduan budidaya musim barat', 'Artikel SINTA 2'],
    dampak: '4 kelompok pembudidaya (± 92 nelayan) di Tejakula dan Bondalem.',
    tags: ['Rumput Laut', 'Budidaya', 'Tejakula', 'Perikanan'], adopsi: false, publikasi: 1
  },
  {
    id: 'BRD-2025-010',
    judul: 'Sistem Informasi Pelayanan Terpadu Desa Berbasis Satu Data Buleleng',
    peneliti: 'Dr. Gede Rasben Dantes, S.T., M.T.I.',
    institusi: 'UNDIKSHA', nidn: '0018127402',
    tim: ['Kadek Yota Ernanda Aryanto, Ph.D.', 'Putu Sudira, M.Kom.'],
    bidang: 'smartcity', kecamatan: 'buleleng', tahun: 2024, skema: 'kolaboratif',
    status: 'selesai', progress: 100, tahap: 7,
    anggaran: 295000000, terserap: 291500000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Diskominfosanti Buleleng', 'Dinas Dukcapil', '12 Pemerintah Desa'],
    kontrak: 'SPK-006/BRIDA-BLL/I/2024', mulai: '2024-01-29', selesai: '2024-12-06',
    abstrak: 'Riset membangun arsitektur interoperabilitas data desa yang memangkas waktu layanan administrasi kependudukan dari rerata 3 hari menjadi 40 menit dan menjadi rujukan kebijakan Satu Data Kabupaten Buleleng.',
    metodologi: 'Rekayasa perangkat lunak Scrum 8 sprint, pengujian usability SUS pada 120 responden, dan evaluasi waktu layanan pre-post implementasi.',
    luaran: ['Aplikasi layanan desa terpadu', 'Dokumen arsitektur Satu Data', 'Perbup Satu Data (adopsi)', 'HKI perangkat lunak'],
    dampak: '12 desa percontohan, 38.700 warga terlayani pada tahun pertama.',
    tags: ['Satu Data', 'E-Government', 'Layanan Desa', 'Interoperabilitas'], adopsi: true, publikasi: 3
  },
  {
    id: 'BRD-2025-011',
    judul: 'Revitalisasi Tenun Endek Buleleng melalui Pewarna Alam dan Desain Kontemporer',
    peneliti: 'Dra. Ni Made Ratminingsih, M.A., Ph.D.',
    institusi: 'UNDIKSHA', nidn: '0009056603',
    tim: ['Ni Kadek Dwi Aryani, S.Sn., M.Sn.', 'I Putu Adi Saputra, S.Ds.'],
    bidang: 'sosial', kecamatan: 'sawan', tahun: 2025, skema: 'insentif',
    status: 'ontrack', progress: 71, tahap: 5,
    anggaran: 132000000, terserap: 93720000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['UMKM Tenun Jinengdalem', 'Dekranasda Buleleng', 'Dinas Perindag'],
    kontrak: 'SPK-048/BRIDA-BLL/IV/2025', mulai: '2025-04-11', selesai: '2025-11-30',
    abstrak: 'Riset mengembangkan 14 formula pewarna alam berbasis flora lokal Buleleng untuk tenun endek serta katalog desain kontemporer yang menaikkan daya saing produk UMKM tenun di pasar hospitality.',
    metodologi: 'Eksperimen pewarnaan dengan uji ketahanan luntur SNI ISO 105, focus group discussion dengan perajin, dan uji preferensi pasar pada 180 responden.',
    luaran: ['14 formula pewarna alam', 'Katalog desain kontemporer', 'Pelatihan 45 perajin'],
    dampak: '5 kelompok perajin tenun (± 118 perajin) di Sawan dan Jinengdalem.',
    tags: ['Endek', 'Pewarna Alam', 'Ekonomi Kreatif', 'UMKM'], adopsi: false, publikasi: 1
  },
  {
    id: 'BRD-2025-012',
    judul: 'Pemetaan Partisipatif Daya Dukung Air Tanah Kawasan Wisata Air Sanih dan Bukti',
    peneliti: 'Dr. Ir. Made Mudita, M.T.',
    institusi: 'PNB', nidn: '0026107001',
    tim: ['I Gede Nyoman Suta Waisnawa, M.T.', 'Ni Wayan Ariani, S.T.'],
    bidang: 'pariwisata', kecamatan: 'kubutambahan', tahun: 2025, skema: 'hibah-daerah',
    status: 'ontrack', progress: 44, tahap: 4,
    anggaran: 198000000, terserap: 87120000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Perumda Air Minum Buleleng', 'Pokdarwis Air Sanih', 'Dinas Lingkungan Hidup'],
    kontrak: 'SPK-055/BRIDA-BLL/V/2025', mulai: '2025-05-06', selesai: '2025-12-19',
    abstrak: 'Riset memetakan neraca air tanah kawasan wisata pesisir timur Buleleng dan menyusun ambang batas pemanfaatan bagi akomodasi wisata agar mata air Sanih tetap lestari.',
    metodologi: 'Survei geolistrik resistivitas 24 titik, analisis isotop stabil sumber air, serta pemodelan neraca air dengan skenario pertumbuhan akomodasi 2025–2035.',
    luaran: ['Peta zonasi air tanah', 'Rekomendasi ambang batas pemanfaatan', 'Policy brief perizinan akomodasi'],
    dampak: 'Kawasan wisata 2 kecamatan dan 3 sumber mata air utama.',
    tags: ['Air Tanah', 'Air Sanih', 'Daya Dukung', 'Geolistrik'], adopsi: false, publikasi: 0
  },
  {
    id: 'BRD-2025-013',
    judul: 'Model Sekolah Ramah Anak Berbasis Tri Hita Karana di Sekolah Dasar Kawasan Seririt',
    peneliti: 'Dr. I Wayan Widiana, S.Pd., M.Pd.',
    institusi: 'UNDIKSHA', nidn: '0011048403',
    tim: ['Ni Nyoman Kusmariyatni, M.Pd.', 'Made Citra Wibawa, M.Pd.'],
    bidang: 'sosial', kecamatan: 'seririt', tahun: 2024, skema: 'mandiri',
    status: 'selesai', progress: 100, tahap: 7,
    anggaran: 96000000, terserap: 95200000, sumber: 'Dana Internal Perguruan Tinggi',
    mitra: ['Dinas Pendidikan Buleleng', 'Gugus Sekolah Seririt II'],
    kontrak: 'SPK-071/BRIDA-BLL/VI/2024', mulai: '2024-06-10', selesai: '2024-12-13',
    abstrak: 'Riset menghasilkan model pembinaan sekolah ramah anak yang mengintegrasikan nilai Tri Hita Karana, terbukti menurunkan insiden perundungan pada sekolah percontohan sebesar 38% dalam satu semester.',
    metodologi: 'Quasi-experiment pretest-posttest control group design pada 8 SD, instrumen skala perundungan tervalidasi, dan analisis ANCOVA.',
    luaran: ['Panduan sekolah ramah anak', 'Instrumen asesmen tervalidasi', 'Jurnal SINTA 2'],
    dampak: '8 sekolah dasar, 1.680 peserta didik.',
    tags: ['Pendidikan', 'Tri Hita Karana', 'Sekolah Ramah Anak'], adopsi: true, publikasi: 2
  },
  {
    id: 'BRD-2025-014',
    judul: 'Diversifikasi Produk Olahan Mangga Buleleng untuk Penguatan Rantai Nilai Petani',
    peneliti: 'Ni Putu Sukanteri, S.P., M.Agb.',
    institusi: 'UNIPAS', nidn: '0824098602',
    tim: ['I Made Tamba, M.P.', 'Ni Luh Made Indah Murdyani, S.TP.'],
    bidang: 'pertanian', kecamatan: 'busungbiu', tahun: 2025, skema: 'insentif',
    status: 'ontrack', progress: 63, tahap: 5,
    anggaran: 118000000, terserap: 74340000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Kelompok Tani Mangga Amerta', 'Dinas Perindag', 'UMKM Olahan Buleleng'],
    kontrak: 'SPK-058/BRIDA-BLL/V/2025', mulai: '2025-05-12', selesai: '2025-12-12',
    abstrak: 'Riset mengembangkan tiga lini produk olahan mangga (puree beku, fruit leather, dan kombucha mangga) beserta analisis kelayakan usaha untuk menyerap surplus panen raya yang selama ini merosot harganya.',
    metodologi: 'Formulasi produk dengan uji hedonik 9 skala, analisis proksimat dan umur simpan metode ASLT, serta analisis kelayakan finansial.',
    luaran: ['3 formula produk olahan', 'Izin edar PIRT', 'Analisis kelayakan usaha kelompok'],
    dampak: '3 kelompok tani dan 6 UMKM olahan di Busungbiu dan Seririt.',
    tags: ['Mangga', 'Pascapanen', 'UMKM', 'Rantai Nilai'], adopsi: false, publikasi: 0
  },
  {
    id: 'BRD-2025-015',
    judul: 'Manajemen Sampah Berbasis Sumber dengan Insinerator Rendah Emisi di Desa Wisata Banjar',
    peneliti: 'Dr. Ketut Agustini, S.Si., M.Si.',
    institusi: 'UNDIKSHA', nidn: '0007087605',
    tim: ['I Gede Sudirtha, M.Pd.', 'Nyoman Sugihartini, M.Pd.'],
    bidang: 'pariwisata', kecamatan: 'banjar', tahun: 2025, skema: 'hibah-daerah',
    status: 'warning', progress: 39, tahap: 3,
    anggaran: 208000000, terserap: 81120000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Dinas Lingkungan Hidup', 'TPS3R Banjar', 'Desa Adat Banjar'],
    kontrak: 'SPK-062/BRIDA-BLL/V/2025', mulai: '2025-05-19', selesai: '2025-12-22',
    abstrak: 'Riset menguji kinerja insinerator skala desa dengan sistem penangkap partikulat sederhana serta menyusun skema retribusi sampah berbasis kesepakatan awig-awig desa adat kawasan wisata.',
    metodologi: 'Uji emisi gas buang mengacu baku mutu KLHK, analisis komposisi sampah SNI 19-3964, dan perancangan skema retribusi partisipatif.',
    luaran: ['Purwarupa insinerator rendah emisi', 'Skema retribusi desa', 'Rekomendasi teknis DLH'],
    dampak: '2 desa wisata, estimasi 4,2 ton sampah/hari.',
    tags: ['Persampahan', 'Desa Wisata', 'Lingkungan'], adopsi: false, publikasi: 0,
    catatanKendala: 'Hasil uji emisi tahap pertama melampaui baku mutu partikulat; perlu revisi desain cerobong sebelum lanjut termin III.'
  },
  {
    id: 'BRD-2025-016',
    judul: 'Aplikasi Deteksi Dini Penyakit Layu Fusarium pada Pisang dengan Computer Vision',
    peneliti: 'Putu Wira Buana, S.Kom., M.T.',
    institusi: 'UNUD', nidn: '0016068104',
    tim: ['I Made Sukarsa, S.T., M.T.', 'Ni Kadek Dwi Rusjayanthi, M.T.'],
    bidang: 'pertanian', kecamatan: 'seririt', tahun: 2025, skema: 'kolaboratif',
    status: 'ontrack', progress: 55, tahap: 4,
    anggaran: 176000000, terserap: 96800000, sumber: 'APBD + Dana Padanan Mitra',
    mitra: ['Dinas Pertanian Buleleng', 'Kelompok Tani Pisang Seririt', 'Balai Proteksi Tanaman'],
    kontrak: 'SPK-050/BRIDA-BLL/IV/2025', mulai: '2025-04-24', selesai: '2025-12-10',
    abstrak: 'Riset melatih model klasifikasi citra daun pisang untuk mendeteksi gejala layu fusarium pada stadium awal, dikemas dalam aplikasi ponsel luring agar dapat dipakai penyuluh di area tanpa sinyal.',
    metodologi: 'Pengumpulan 12.400 citra berlabel, pelatihan model CNN transfer learning, validasi silang 5-fold, dan uji lapangan bersama 24 penyuluh.',
    luaran: ['Model deteksi akurasi >92%', 'Aplikasi ponsel luring', 'HKI perangkat lunak'],
    dampak: '24 penyuluh pertanian dan 380 ha area tanam pisang.',
    tags: ['Computer Vision', 'Pisang', 'Deteksi Penyakit', 'Penyuluhan'], adopsi: false, publikasi: 1
  },
  {
    id: 'BRD-2025-017',
    judul: 'Kajian Ketahanan Ekonomi Perempuan Pesisir melalui Koperasi Pengolahan Ikan Sanih',
    peneliti: 'Dr. Ni Luh Wayan Sayang Telagawathi, S.E., M.Si.',
    institusi: 'UNDIKSHA', nidn: '0028117703',
    tim: ['Ni Made Suci, S.E., M.Si.', 'Gede Putu Agus Jana Susila, M.B.A.'],
    bidang: 'kelautan', kecamatan: 'tejakula', tahun: 2024, skema: 'mandiri',
    status: 'selesai', progress: 100, tahap: 7,
    anggaran: 88000000, terserap: 86240000, sumber: 'Dana Internal Perguruan Tinggi',
    mitra: ['Koperasi Wanita Pesisir', 'Dinas Koperasi & UKM'],
    kontrak: 'SPK-078/BRIDA-BLL/VII/2024', mulai: '2024-07-08', selesai: '2024-12-16',
    abstrak: 'Riset memetakan pola ketahanan ekonomi rumah tangga nelayan yang dipimpin perempuan dan merumuskan model koperasi pengolahan ikan yang meningkatkan pendapatan anggota rerata 31%.',
    metodologi: 'Survei 220 rumah tangga, analisis regresi berganda determinan pendapatan, serta action research pendampingan koperasi selama 5 bulan.',
    luaran: ['Model koperasi pengolahan', 'Policy brief pemberdayaan pesisir', 'Jurnal SINTA 3'],
    dampak: '1 koperasi dengan 84 anggota perempuan pesisir.',
    tags: ['Pemberdayaan', 'Koperasi', 'Pesisir', 'Gender'], adopsi: true, publikasi: 1
  },
  {
    id: 'BRD-2025-018',
    judul: 'Optimasi Rute Angkutan Sampah Perkotaan Singaraja dengan Algoritma Vehicle Routing',
    peneliti: 'I Nyoman Purnama, S.Kom., M.Cs.',
    institusi: 'STIKOM', nidn: '0821058801',
    tim: ['Ni Made Estiyanti, M.M.', 'I Gede Putu Krisna Juliharta, M.T.'],
    bidang: 'smartcity', kecamatan: 'buleleng', tahun: 2025, skema: 'insentif',
    status: 'ontrack', progress: 77, tahap: 6,
    anggaran: 122000000, terserap: 93940000, sumber: 'APBD Kabupaten Buleleng',
    mitra: ['Dinas Lingkungan Hidup', 'Diskominfosanti Buleleng'],
    kontrak: 'SPK-036/BRIDA-BLL/III/2025', mulai: '2025-03-26', selesai: '2025-11-21',
    abstrak: 'Riset menghasilkan penjadwalan dan rute armada pengangkut sampah kota Singaraja yang memangkas jarak tempuh harian 23% serta menurunkan konsumsi BBM operasional DLH.',
    metodologi: 'Pemodelan Capacitated Vehicle Routing Problem dengan metaheuristik Ant Colony Optimization, validasi menggunakan data GPS tracker 3 bulan.',
    luaran: ['Aplikasi perencanaan rute', 'Rekomendasi jadwal armada', 'Artikel SINTA 2'],
    dampak: '14 armada DLH dan 62 titik TPS di kawasan perkotaan Singaraja.',
    tags: ['Optimasi', 'Persampahan', 'Smart City', 'Logistik'], adopsi: false, publikasi: 1
  }
];

export const PENDANAAN = [
  {
    id: 'FND-01', situs: 'https://bulelengkab.go.id', situsNama: 'BRIDA Kabupaten Buleleng', nama: 'Hibah Riset Prioritas Daerah Buleleng 2026 Batch I',
    penyelenggara: 'BRIDA Kabupaten Buleleng', skema: 'hibah-daerah',
    plafon: 300000000, kuota: 18, deadline: '2025-11-28', status: 'open',
    bidangTarget: ['pertanian', 'pariwisata', 'kelautan'],
    syarat: ['Ketua peneliti ber-NIDN/NIP aktif', 'Minimal 1 mitra OPD atau komunitas Buleleng', 'Luaran wajib policy brief + publikasi SINTA', 'Bebas tunggakan laporan riset sebelumnya'],
    ket: 'Diprioritaskan untuk isu ketahanan pangan, hilirisasi komoditas, dan pariwisata berkelanjutan Bali Utara.'
  },
  {
    id: 'FND-02', situs: 'https://bulelengkab.go.id', situsNama: 'BRIDA Kabupaten Buleleng', nama: 'Insentif Riset Terapan & Hilirisasi Produk Lokal',
    penyelenggara: 'BRIDA × Dinas Perindag Buleleng', skema: 'insentif',
    plafon: 150000000, kuota: 24, deadline: '2025-10-17', status: 'closing',
    bidangTarget: ['pertanian', 'sosial'],
    syarat: ['Riset pada TKT 4–6', 'Melibatkan minimal 1 UMKM/koperasi lokal', 'Purwarupa siap uji lapangan', 'Komitmen pendampingan 6 bulan'],
    ket: 'Fokus pada peningkatan nilai tambah komoditas unggulan: kopi, mangga, anggur, endek, dan produk perikanan.'
  },
  {
    id: 'FND-03', situs: 'https://bulelengkab.go.id', situsNama: 'BRIDA Kabupaten Buleleng', nama: 'Riset Kolaboratif Pentahelix Bali Utara',
    penyelenggara: 'BRIDA × Konsorsium Perguruan Tinggi', skema: 'kolaboratif',
    plafon: 450000000, kuota: 8, deadline: '2025-12-12', status: 'open',
    bidangTarget: ['smartcity', 'kelautan', 'pariwisata'],
    syarat: ['Konsorsium minimal 2 perguruan tinggi', 'Dana padanan mitra minimal 20%', 'Melibatkan OPD dan komunitas sasaran', 'Durasi riset multi-tahun (2 tahun)'],
    ket: 'Skema unggulan untuk riset lintas sektor berdampak luas dengan pembiayaan bersama industri atau lembaga mitra.'
  },
  {
    id: 'FND-04', situs: 'https://brin.go.id', situsNama: 'Badan Riset dan Inovasi Nasional', nama: 'Kemitraan Riset BRIN Fasilitasi Daerah',
    penyelenggara: 'BRIN × BRIDA Buleleng', skema: 'brin',
    plafon: 500000000, kuota: 5, deadline: '2026-01-30', status: 'soon',
    bidangTarget: ['smartcity', 'kelautan'],
    syarat: ['Proposal selaras Prioritas Riset Nasional', 'Klirens etik BRIN', 'Skema co-funding daerah', 'Kepala peneliti bergelar doktor'],
    ket: 'Pendaftaran dibuka melalui portal BRIN dengan surat rekomendasi BRIDA Kabupaten Buleleng.'
  },
  {
    id: 'FND-05', situs: 'https://bulelengkab.go.id', situsNama: 'BRIDA Kabupaten Buleleng', nama: 'Beasiswa Riset Tesis & Disertasi Bertema Buleleng',
    penyelenggara: 'BRIDA Kabupaten Buleleng', skema: 'mandiri',
    plafon: 25000000, kuota: 30, deadline: '2025-11-07', status: 'closing',
    bidangTarget: ['sosial', 'pertanian', 'pariwisata'],
    syarat: ['Mahasiswa S2/S3 aktif', 'Topik riset berlokasi di Kabupaten Buleleng', 'Surat pengantar pembimbing', 'Wajib menyerahkan ringkasan kebijakan'],
    ket: 'Mendorong regenerasi peneliti muda dengan objek kajian wilayah Buleleng.'
  },
  {
    id: 'FND-06', situs: 'https://bulelengkab.go.id', situsNama: 'BRIDA Kabupaten Buleleng', nama: 'Dana Diseminasi & Publikasi Jurnal Terakreditasi',
    penyelenggara: 'BRIDA Kabupaten Buleleng', skema: 'insentif',
    plafon: 15000000, kuota: 40, deadline: '2025-12-20', status: 'open',
    bidangTarget: ['pertanian', 'pariwisata', 'smartcity', 'kelautan', 'sosial'],
    syarat: ['Artikel berbasis riset di wilayah Buleleng', 'Target jurnal SINTA 1–3 atau Scopus', 'Surat penerimaan (LoA) atau bukti submit', 'Mencantumkan afiliasi kemitraan BRIDA'],
    ket: 'Penggantian biaya publikasi (APC) dan biaya diseminasi hasil riset kepada masyarakat sasaran.'
  }
];

/* --------------------------------------------------------------------------
   CATATAN TAUTAN SOSIAL MEDIA
   Tautan di bawah masih PLACEHOLDER. Ganti dengan URL unggahan asli milik
   BRIDA / Pemkab Buleleng sebelum portal dipublikasikan, agar pembaca tidak
   diarahkan ke akun yang keliru.
   -------------------------------------------------------------------------- */
export const SOSMED_RESMI = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  tiktok: 'https://www.tiktok.com/',
  youtube: 'https://www.youtube.com/'
};

export const BERITA = [
  {
    id: 'N-01', kategori: 'Kebijakan', tanggal: '2025-09-04',
    judul: 'Bupati Buleleng Tetapkan Perbup Standar Wisata Bahari Lovina Berbasis Hasil Riset',
    ringkas: 'Rekomendasi dari riset BRD-2025-002 resmi diadopsi menjadi Peraturan Bupati yang mengatur zonasi, kuota perahu, dan sertifikasi operator dolphin watching di kawasan Lovina.',
    penulis: 'Humas BRIDA Buleleng',
    gambar: '/images/berita/berita-01.jpg',
    isi: [
      'Pemerintah Kabupaten Buleleng resmi menetapkan Peraturan Bupati tentang standar penyelenggaraan atraksi wisata bahari di kawasan Lovina. Regulasi ini merupakan adopsi langsung dari rekomendasi riset BRD-2025-002 yang dikerjakan tim peneliti Universitas Udayana bersama Pokdarwis Kalibukbuk dan Dinas Pariwisata.',
      'Perbup mengatur tiga hal pokok: zonasi jarak aman perahu terhadap mamalia laut, kuota perahu per sesi pengamatan, serta kewajiban sertifikasi bagi operator. Ketiganya disusun dari observasi perilaku lumba-lumba selama 90 sesi dan analisis daya dukung kawasan.',
      'Kepala BRIDA menyebut penetapan ini sebagai contoh konkret bagaimana riset daerah dapat langsung menjadi instrumen kebijakan. Sebanyak 86 operator perahu dan empat kelompok Pokdarwis akan mengikuti pelatihan sertifikasi bertahap mulai triwulan berikutnya.'
    ]
  },
  {
    id: 'N-02', kategori: 'Pendanaan', tanggal: '2025-08-28',
    judul: 'Hibah Riset Prioritas Daerah 2026 Batch I Dibuka, Pagu Total Rp 5,4 Miliar',
    ringkas: 'BRIDA membuka 18 kuota pendanaan riset dengan plafon hingga Rp 300 juta per judul. Pengusul wajib menautkan proposal pada sasaran RPJMD Buleleng 2025–2029.',
    penulis: 'Subbag Perencanaan BRIDA',
    gambar: '/images/berita/berita-02.jpg',
    isi: [
      'Badan Riset dan Inovasi Daerah Kabupaten Buleleng membuka Batch I Hibah Riset Prioritas Daerah Tahun Anggaran 2026. Tersedia 18 kuota pendanaan yang diperebutkan peneliti dari perguruan tinggi dan lembaga litbang mitra.',
      'Pengusul wajib menautkan substansi proposal pada salah satu sasaran RPJMD Buleleng 2025–2029, serta melibatkan minimal satu mitra lapangan, baik organisasi perangkat daerah, kelompok subak, pokdarwis, maupun pelaku UMKM.',
      'Seluruh berkas diajukan melalui portal SINGA RISET BULELENG. Proses verifikasi dipangkas menjadi maksimal 14 hari kerja karena seluruh telaah kini dilakukan secara digital.'
    ]
  },
  {
    id: 'N-03', kategori: 'Monev', tanggal: '2025-08-19',
    judul: 'Monev Tahap III: 34 Riset Daerah Dievaluasi Tim Pakar di Kantor BRIDA',
    ringkas: 'Sebanyak 34 riset aktif memaparkan capaian termin kedua. Tim pakar mencatat 5 riset berstatus koreksi dan memberikan tenggat perbaikan dokumen 14 hari kerja.',
    penulis: 'Tim Monev BRIDA',
    gambar: '/images/berita/berita-03.jpg',
    isi: [
      'Siklus monitoring dan evaluasi tahap ketiga tahun anggaran 2025 digelar selama tiga hari di kantor BRIDA Kabupaten Buleleng. Seluruh 34 riset aktif memaparkan capaian termin kedua di hadapan tim pakar lintas disiplin.',
      'Penilaian menggunakan matriks enam indikator: kesesuaian roadmap, kualitas metodologi, ketercapaian target fisik, kepatuhan jadwal, akuntabilitas anggaran, dan potensi dampak lapangan.',
      'Hasilnya, lima riset berstatus koreksi dan satu riset menerima Surat Peringatan pertama atas keterlambatan laporan. Seluruhnya diberi tenggat perbaikan dokumen 14 hari kerja sebelum pencairan termin berikutnya.'
    ]
  },
  {
    id: 'N-04', kategori: 'Kolaborasi', tanggal: '2025-08-11',
    judul: 'BRIDA Buleleng dan Undiksha Perbarui Perjanjian Kerja Sama Riset Terapan',
    ringkas: 'Kerja sama mencakup penempatan mahasiswa magang riset di OPD, akses laboratorium bersama, serta komitmen 12 policy brief per tahun untuk kebutuhan perencanaan daerah.',
    penulis: 'Humas BRIDA Buleleng',
    gambar: '/images/berita/berita-04.jpg',
    isi: [
      'Perjanjian kerja sama antara BRIDA Kabupaten Buleleng dan Universitas Pendidikan Ganesha diperbarui untuk periode lima tahun ke depan. Penandatanganan berlangsung di Gedung Rektorat Undiksha.',
      'Cakupan kerja sama meliputi penempatan mahasiswa magang riset di organisasi perangkat daerah, pemanfaatan bersama fasilitas laboratorium, serta komitmen penyusunan minimal 12 policy brief setiap tahun.',
      'Policy brief tersebut akan menjadi bahan rujukan penyusunan Rencana Kerja OPD, sehingga perencanaan pembangunan daerah bersandar pada bukti ilmiah yang terverifikasi.'
    ]
  },
  {
    id: 'N-05', kategori: 'Inovasi', tanggal: '2025-07-30',
    judul: 'Purwarupa Irigasi Presisi Subak Sukasada Hemat Air 27% pada Musim Tanam Pertama',
    ringkas: 'Uji lapangan di tiga tempek subak menunjukkan penghematan air signifikan tanpa mengubah pola pembagian air adat. Dinas Pertanian menyiapkan replikasi di dua kecamatan.',
    penulis: 'Redaksi Singa Riset',
    gambar: '/images/berita/berita-05.jpg',
    isi: [
      'Sistem irigasi presisi berbasis sensor kelembapan tanah yang dipasang di tiga tempek Subak Padanggalak mencatat penghematan air rata-rata 27 persen pada musim tanam pertama 2025.',
      'Yang membuat sistem ini diterima krama subak adalah desainnya yang tidak mengubah struktur pembagian air menurut awig-awig. Otomatisasi hanya bekerja pada tingkat petak, sementara giliran air tetap mengikuti keputusan pekaseh.',
      'Dinas Pertanian Kabupaten Buleleng menyiapkan replikasi sistem serupa di dua kecamatan lain, dengan catatan perlu analisis sensitivitas biaya operasional agar kelompok tani mampu merawatnya secara mandiri.'
    ]
  },
  {
    id: 'N-06', kategori: 'Diseminasi', tanggal: '2025-07-18',
    judul: 'Seminar Hasil Riset Daerah 2025 Hadirkan 40 Paparan dan Pameran Purwarupa',
    ringkas: 'Kegiatan tahunan mempertemukan peneliti, kepala OPD, kelompok subak, dan pelaku UMKM untuk menjodohkan hasil riset dengan kebutuhan lapangan di sembilan kecamatan.',
    penulis: 'Panitia Seminar BRIDA',
    gambar: '/images/berita/berita-06.jpg',
    isi: [
      'Seminar Hasil Riset Daerah 2025 berlangsung dua hari dengan 40 paparan ilmiah dan pameran purwarupa hasil riset terapan. Acara dibuka Bupati Buleleng dan diikuti lebih dari 300 peserta.',
      'Selain paparan, panitia menyediakan sesi temu mitra yang mempertemukan peneliti dengan kepala OPD, pengurus subak, pengelola desa wisata, dan pelaku UMKM untuk menjodohkan hasil riset dengan kebutuhan lapangan.',
      'Sejumlah purwarupa yang dipamerkan, mulai dari alat ukur kelembapan tanah hingga produk olahan mangga, langsung mendapat permintaan uji coba dari kelompok masyarakat di sembilan kecamatan.'
    ]
  }
];

export const PUBLIKASI = [
  {
    id: 'P-01', tipe: 'Jurnal', judul: 'Precision Irrigation Adoption in Balinese Subak: Reconciling IoT Automation with Customary Water Rights',
    penulis: 'Suarnaya, I G., Pastini, N. L., Wijaya, I K. A.', sumber: 'Jurnal Sumber Daya Air Indonesia, Vol. 21(2), 2025',
    indeks: 'SINTA 2', doi: '10.24843/JSDAI.2025.v21.i02.p04', tahun: 2025, bidang: 'pertanian', unduhan: 1284
  },
  {
    id: 'P-02', tipe: 'Policy Brief', judul: 'Menata Wisata Dolphin Watching Lovina: Kuota, Zonasi, dan Sertifikasi Operator',
    penulis: 'Sriwahyuni, N. M. A., Restu, I W.', sumber: 'Policy Brief BRIDA Buleleng No. 07/2025',
    indeks: 'BRIDA', doi: '-', tahun: 2025, bidang: 'pariwisata', unduhan: 2431
  },
  {
    id: 'P-03', tipe: 'Jurnal', judul: 'Coral Restoration Performance of Solar-Powered Biorock Structures in Pemuteran Bay, North Bali',
    penulis: 'Karang, I W. G. A., Damayanti, N. P. E., Suwastika, I M.', sumber: 'Marine Environmental Research, Vol. 198, 2025',
    indeks: 'Scopus Q1', doi: '10.1016/j.marenvres.2025.106412', tahun: 2025, bidang: 'kelautan', unduhan: 876
  },
  {
    id: 'P-04', tipe: 'Policy Brief', judul: 'Arsitektur Satu Data Buleleng: Prasyarat Interoperabilitas Layanan Desa',
    penulis: 'Dantes, G. R., Aryanto, K. Y. E.', sumber: 'Policy Brief BRIDA Buleleng No. 02/2024',
    indeks: 'BRIDA', doi: '-', tahun: 2024, bidang: 'smartcity', unduhan: 3120
  },
  {
    id: 'P-05', tipe: 'Buku', judul: 'Inovasi Pertanian Lahan Kering Bali Utara: Dari Limbah Ternak ke Nilai Tambah Petani',
    penulis: 'Suarna, I N., Sudaryati, N. L. G.', sumber: 'Penerbit Undiksha Press, Singaraja, 2024',
    indeks: 'ISBN 978-623-7449-88-1', doi: '-', tahun: 2024, bidang: 'pertanian', unduhan: 642
  },
  {
    id: 'P-06', tipe: 'Jurnal', judul: 'Early Flash Flood Warning Architecture for Small Urban Catchments: A Case of Buleleng River',
    penulis: 'Pramana, I G. N. A., Permana, P. A. G.', sumber: 'Jurnal Teknologi Informasi dan Ilmu Komputer, Vol. 12(3), 2025',
    indeks: 'SINTA 2', doi: '10.25126/jtiik.2025123901', tahun: 2025, bidang: 'smartcity', unduhan: 954
  },
  {
    id: 'P-07', tipe: 'Policy Brief', judul: 'Ambang Batas Pemanfaatan Air Tanah untuk Akomodasi Wisata Pesisir Timur Buleleng',
    penulis: 'Mudita, M., Waisnawa, I G. N. S.', sumber: 'Policy Brief BRIDA Buleleng No. 09/2025',
    indeks: 'BRIDA', doi: '-', tahun: 2025, bidang: 'pariwisata', unduhan: 517
  },
  {
    id: 'P-08', tipe: 'Prosiding', judul: 'Transfer Learning for Early Fusarium Wilt Detection on Banana Leaves in Low-Connectivity Areas',
    penulis: 'Buana, P. W., Sukarsa, I M., Rusjayanthi, N. K. D.', sumber: 'Prosiding Seminar Nasional Teknologi Informasi 2025',
    indeks: 'SINTA 4', doi: '10.36002/snti.v9i1.2189', tahun: 2025, bidang: 'pertanian', unduhan: 388
  },
  {
    id: 'P-09', tipe: 'Jurnal', judul: 'Women-Led Fish Processing Cooperatives and Household Economic Resilience in North Bali Coastal Villages',
    penulis: 'Telagawathi, N. L. W. S., Suci, N. M.', sumber: 'Jurnal Ekonomi dan Pembangunan Indonesia, Vol. 24(1), 2024',
    indeks: 'SINTA 3', doi: '10.21002/jepi.2024.v24.i1.1088', tahun: 2024, bidang: 'kelautan', unduhan: 731
  }
];

export const MILESTONES = [
  { n: 1, nama: 'Proposal & Kontrak',       short: 'Proposal' },
  { n: 2, nama: 'Klirens Etik & Kick-off',  short: 'Klirens Etik' },
  { n: 3, nama: 'Pengumpulan Data',         short: 'Data Lapangan' },
  { n: 4, nama: 'Laporan Kemajuan (50%)',   short: 'Kemajuan 50%' },
  { n: 5, nama: 'Uji Lapangan / Purwarupa', short: 'Uji Lapangan' },
  { n: 6, nama: 'Laporan Akhir & SPJ',      short: 'Laporan Akhir' },
  { n: 7, nama: 'Publikasi & Diseminasi',   short: 'Diseminasi' }
];

export const INDIKATOR = [
  { id: 'i1', nama: 'Kesesuaian Roadmap Riset Buleleng',  bobot: 20, ket: 'Keterhubungan substansi riset dengan Peta Jalan Riset Daerah 2025–2029 dan sasaran RPJMD.' },
  { id: 'i2', nama: 'Kualitas Metodologi Ilmiah',         bobot: 20, ket: 'Ketepatan desain riset, instrumen, validitas data, serta kepatuhan klirens etik.' },
  { id: 'i3', nama: 'Ketercapaian Target Fisik & Output', bobot: 20, ket: 'Realisasi luaran wajib dan tambahan terhadap kontrak riset yang ditandatangani.' },
  { id: 'i4', nama: 'Kepatuhan Jadwal Waktu',             bobot: 15, ket: 'Ketepatan penyampaian logbook, laporan kemajuan, dan pemenuhan termin kegiatan.' },
  { id: 'i5', nama: 'Akuntabilitas Anggaran & SPJ',       bobot: 15, ket: 'Kelengkapan bukti pertanggungjawaban keuangan dan kewajaran realisasi serapan.' },
  { id: 'i6', nama: 'Potensi Dampak Lapangan',            bobot: 10, ket: 'Kemanfaatan langsung bagi OPD, subak, pokdarwis, UMKM, atau masyarakat sasaran.' }
];

export const SKOR = {
  'BRD-2025-001': { i1: 92, i2: 88, i3: 85, i4: 90, i5: 86, i6: 94,
    catatan: 'Capaian teknis di atas target termin. Tim pakar meminta penambahan analisis sensitivitas biaya operasional agar replikasi ke subak lain terukur.', evaluator: 'Dr. I Ketut Sudiana, M.Si.', tanggal: '2025-08-19' },
  'BRD-2025-002': { i1: 95, i2: 90, i3: 88, i4: 92, i5: 89, i6: 96,
    catatan: 'Draf Perbup sudah masuk pembahasan Bagian Hukum Setda. Direkomendasikan menjadi contoh praktik baik adopsi kebijakan berbasis riset.', evaluator: 'Prof. Dr. Ni Made Ratminingsih', tanggal: '2025-08-19' },
  'BRD-2025-003': { i1: 84, i2: 78, i3: 62, i4: 58, i5: 66, i6: 80,
    catatan: 'Uji organoleptik tertunda karena keterbatasan panelis Q-Grader. Wajib menyampaikan jadwal susulan dan bukti pemesanan laboratorium dalam 14 hari kerja.', evaluator: 'Dr. I Ketut Sudiana, M.Si.', tanggal: '2025-08-20' },
  'BRD-2025-004': { i1: 90, i2: 91, i3: 93, i4: 88, i5: 90, i6: 92,
    catatan: 'Integrasi dashboard dengan BPBD berjalan baik. Perlu dokumen serah terima aset sensor sebelum penutupan kontrak.', evaluator: 'I Gede Wirawan, S.T., M.T.', tanggal: '2025-08-21' },
  'BRD-2025-006': { i1: 80, i2: 82, i3: 48, i4: 42, i5: 55, i6: 74,
    catatan: 'Terbit SP-1 atas keterlambatan laporan termin II. Diminta menyerahkan rencana percepatan digitalisasi dan bukti pengadaan alat paling lambat 30 September 2025.', evaluator: 'Dr. Ni Wayan Sukerti, M.Pd.', tanggal: '2025-08-22' },
  'BRD-2025-008': { i1: 88, i2: 85, i3: 64, i4: 60, i5: 58, i6: 86,
    catatan: 'Kendala perizinan PLN diakui sebagai faktor eksternal, namun kelengkapan SPJ termin II tetap menjadi kewajiban peneliti sebelum pencairan termin III.', evaluator: 'I Gede Wirawan, S.T., M.T.', tanggal: '2025-08-21' },
  'BRD-2025-015': { i1: 82, i2: 76, i3: 52, i4: 55, i5: 70, i6: 78,
    catatan: 'Hasil uji emisi belum memenuhi baku mutu partikulat. Diwajibkan revisi desain cerobong dan uji ulang sebelum pengajuan termin III.', evaluator: 'Dr. Ketut Agus Seputra, M.T.', tanggal: '2025-08-22' }
};

export const BERKAS = {
  'BRD-2025-001': [
    { nama: 'Laporan-Kemajuan-Termin-II-BRD001.pdf', tipe: 'pdf', ukuran: '4,2 MB', tgl: '2025-08-12', status: 'verified' },
    { nama: 'Dokumentasi-Instalasi-Node-Subak.jpg',  tipe: 'img', ukuran: '3,1 MB', tgl: '2025-08-12', status: 'verified', geo: '-8.1094, 115.1042 · Sukasada' },
    { nama: 'Demo-Purwarupa-Katup-Otomatis.mp4',      tipe: 'video', ukuran: 'Tautan streaming', tgl: '2025-08-13', status: 'verified' },
    { nama: 'SPJ-Termin-II-Rekap-Belanja.pdf',        tipe: 'pdf', ukuran: '1,8 MB', tgl: '2025-08-14', status: 'review' }
  ],
  'BRD-2025-003': [
    { nama: 'Laporan-Kemajuan-Termin-I-BRD003.pdf', tipe: 'pdf', ukuran: '3,4 MB', tgl: '2025-07-29', status: 'verified' },
    { nama: 'Foto-Unit-Fermentasi-Wanagiri.jpg',    tipe: 'img', ukuran: '2,6 MB', tgl: '2025-07-29', status: 'verified', geo: '-8.2361, 115.1197 · Wanagiri' },
    { nama: 'Hasil-Uji-Organoleptik-Batch-1.pdf',   tipe: 'pdf', ukuran: '0,9 MB', tgl: '2025-08-18', status: 'revisi' }
  ],
  'BRD-2025-006': [
    { nama: 'Laporan-Kemajuan-Termin-I-BRD006.pdf', tipe: 'pdf', ukuran: '2,7 MB', tgl: '2025-06-30', status: 'verified' },
    { nama: 'Sampel-Transliterasi-20-Lontar.pdf',   tipe: 'pdf', ukuran: '5,8 MB', tgl: '2025-08-05', status: 'revisi' }
  ]
};

/* Kolom `gambar` menunjuk foto kegiatan BRIDA di public/images/roadmap/.
   Bila berkas belum ada, latar bermotif otomatis tampil sebagai pengganti. */
export const ROADMAP = [
  {
    tahun: '2025', tema: 'Fondasi & Tata Kelola', status: 'current',
    gambar: '/images/roadmap/2025.jpg',
    target: 'Penetapan prioritas riset daerah, integrasi data, dan konsolidasi kelembagaan riset.',
    butir: ['Penetapan 5 bidang prioritas riset daerah', 'Digitalisasi seluruh siklus monev riset', 'Klirens etik riset daerah beroperasi penuh', 'Baseline data riset 9 kecamatan'],
    indikator: '34 riset dimonitor · 12 policy brief'
  },
  {
    tahun: '2026', tema: 'Penguatan Kapasitas', status: 'next',
    gambar: '/images/roadmap/2026.jpg',
    target: 'Peningkatan mutu metodologi dan perluasan jejaring peneliti daerah.',
    butir: ['Sertifikasi 60 peneliti daerah', 'Laboratorium bersama lintas perguruan tinggi', 'Integrasi jurnal daerah terakreditasi SINTA', 'Skema riset multi-tahun perdana'],
    indikator: '45 riset aktif · 20 publikasi terakreditasi'
  },
  {
    tahun: '2027', tema: 'Hilirisasi Terapan', status: 'future',
    gambar: '/images/roadmap/2027.jpg',
    target: 'Percepatan alih teknologi ke UMKM, subak, dan kelompok masyarakat.',
    butir: ['15 purwarupa naik ke TKT 7', 'Inkubator inovasi daerah beroperasi', 'Skema dana padanan industri lokal', '5 pengajuan paten/indikasi geografis'],
    indikator: '10 produk hilirisasi · 5 HKI baru'
  },
  {
    tahun: '2028', tema: 'Integrasi Kebijakan', status: 'future',
    gambar: '/images/roadmap/2028.jpg',
    target: 'Setiap dokumen perencanaan daerah bersandar pada bukti ilmiah terverifikasi.',
    butir: ['Policy brief wajib pada setiap Renja OPD', 'Sistem rekomendasi kebijakan berbasis data', 'Evaluasi dampak riset terhadap IPM & PDRB', 'Replikasi inovasi antar-kecamatan'],
    indikator: '80% riset teradopsi kebijakan'
  },
  {
    tahun: '2029', tema: 'Smart Island Buleleng', status: 'future',
    gambar: '/images/roadmap/2029.jpg',
    target: 'Ekosistem riset mandiri yang menopang pembangunan berkelanjutan Bali Utara.',
    butir: ['Pusat unggulan riset Bali Utara', 'Kemandirian pendanaan riset 40% non-APBD', 'Platform data riset terbuka terintegrasi nasional', 'Jejaring riset internasional Bali Utara'],
    indikator: 'Indeks Daya Saing Daerah naik 2 tingkat'
  }
];

export const SEKTOR_ROADMAP = [
  { id: 'pangan', nama: 'Kedaulatan Pangan & Subak', ikon: 'leaf',
    deskripsi: 'Menjaga produktivitas lahan sawah dan lahan kering Buleleng di tengah tekanan alih fungsi dan anomali iklim, dengan menempatkan kelembagaan subak sebagai simpul inovasi.',
    target: ['Efisiensi air irigasi 30% pada 2027', 'Regenerasi 500 petani muda', 'Swasembada benih hortikultura lokal'],
    riset: 5 },
  { id: 'heritage', nama: 'Heritage & Pariwisata Berkelanjutan', ikon: 'landmark',
    deskripsi: 'Menyeimbangkan pertumbuhan kunjungan wisata Bali Utara dengan daya dukung lingkungan dan pelestarian warisan budaya Buleleng seperti lontar, endek, dan desa adat.',
    target: ['Sertifikasi 200 operator wisata', 'Digitalisasi 1.000 arsip lontar', 'Zonasi daya dukung 5 kawasan wisata'],
    riset: 4 },
  { id: 'ebt', nama: 'Energi Baru Terbarukan & Lingkungan', ikon: 'bolt',
    deskripsi: 'Mendorong kemandirian energi desa dan pengelolaan lingkungan berbasis komunitas, khususnya di kawasan pesisir dan desa wisata dengan tekanan sampah tinggi.',
    target: ['20 desa energi mandiri pada 2029', 'Bauran EBT fasilitas publik 25%', 'Pengurangan sampah ke TPA 30%'],
    riset: 3 },
  { id: 'hilirisasi', nama: 'Hilirisasi Komoditas & UMKM', ikon: 'factory',
    deskripsi: 'Menaikkan nilai tambah komoditas unggulan Buleleng, yaitu kopi, mangga, anggur, rumput laut, dan tenun, melalui standarisasi mutu, kemasan, dan akses pasar.',
    target: ['10 produk berindikasi geografis', 'Nilai tambah komoditas naik 40%', '100 UMKM naik kelas'],
    riset: 4 },
  { id: 'smartisland', nama: 'Smart Island & Tata Kelola Data', ikon: 'cpu',
    deskripsi: 'Membangun tulang punggung data dan layanan digital pemerintahan Buleleng agar keputusan pembangunan berbasis data aktual dan dapat diaudit publik.',
    target: ['Satu Data Buleleng terintegrasi penuh', '148 desa terlayani sistem digital', 'Portal data terbuka riset daerah'],
    riset: 4 }
];

export const STATS = {
  totalRiset: 169,
  risetAktif: 34,
  peneliti: 412,
  institusi: 32,
  policyBrief: 27,
  adopsiKebijakan: 21,
  anggaran2025: 5480000000,
  serapan2025: 3612000000,
  desaTerdampak: 96,
  publikasi: 138,
  hki: 14
};

export const TREN_TAHUNAN = [
  { tahun: 2021, riset: 14, anggaran: 1350000000 },
  { tahun: 2022, riset: 21, anggaran: 1980000000 },
  { tahun: 2023, riset: 29, anggaran: 2760000000 },
  { tahun: 2024, riset: 38, anggaran: 4120000000 },
  { tahun: 2025, riset: 34, anggaran: 5480000000 }
];

/* ==========================================================================
   DOKUMENTASI PUBLIKASI RISET
   Arsip visual tiap riset: foto lapangan, video, dan narasi pelaksanaan.

   Foto  : taruh berkas di public/images/dokumentasi/ sesuai nama di `foto`.
   Video : cukup isi tautan YouTube pada `video` — tidak perlu unggah berkas.
           Kosongkan (null) bila belum ada video.
   ========================================================================== */
export const DOKUMENTASI = [
  {
    id: 'DOK-01', risetId: 'BRD-2025-001',
    judul: 'Pemasangan Node Sensor Irigasi Presisi di Subak Padanggalak',
    bidang: 'pertanian', kecamatan: 'sukasada', tanggal: '2025-08-12',
    narasi: 'Dua belas node sensor kelembapan tanah dipasang pada tiga tempek Subak Padanggalak. Pemasangan dilakukan bersama pekaseh dan krama subak agar penempatan alat tidak mengganggu jalur air adat. Setiap node mengirim data kelembapan tiap 15 menit ke dashboard Dinas Pertanian, sekaligus menyalakan katup otomatis ketika ambang batas kekeringan tercapai. Pada musim tanam pertama, sistem mencatat penghematan air rata-rata 27 persen dibanding petak kontrol.',
    foto: [
      { src: '/images/dokumentasi/dok-brd001-1.jpg', ket: 'Pemasangan node sensor di pematang tempek hulu' },
      { src: '/images/dokumentasi/dok-brd001-2.jpg', ket: 'Kalibrasi katup otomatis bersama krama subak' },
      { src: '/images/dokumentasi/dok-brd001-3.jpg', ket: 'Dashboard pemantauan debit harian di kantor dinas' }
    ],
    video: null,
    galeriVideo: 'Demo purwarupa katup adaptif (tautan menyusul)'
  },
  {
    id: 'DOK-02', risetId: 'BRD-2025-002',
    judul: 'Observasi Perilaku Lumba-lumba dan Uji Coba Zonasi Perahu Lovina',
    bidang: 'pariwisata', kecamatan: 'banjar', tanggal: '2025-07-22',
    narasi: 'Tim peneliti melakukan 90 sesi observasi focal follow untuk memetakan reaksi mamalia laut terhadap jarak dan jumlah perahu. Hasilnya menjadi dasar penetapan zona jarak aman dan kuota perahu per sesi. Uji coba penerapan zonasi dilakukan bersama 86 operator perahu Kalibukbuk selama tiga pekan, disertai pelatihan aba-aba komunikasi antarperahu agar manuver tidak memecah kelompok lumba-lumba.',
    foto: [
      { src: '/images/dokumentasi/dok-brd002-1.jpg', ket: 'Sesi observasi perilaku mamalia laut dari perahu pemantau' },
      { src: '/images/dokumentasi/dok-brd002-2.jpg', ket: 'Sosialisasi zonasi jarak aman bersama operator perahu' },
      { src: '/images/dokumentasi/dok-brd002-3.jpg', ket: 'Simulasi pola manuver perahu sesuai kuota per sesi' }
    ],
    video: null,
    galeriVideo: 'Rekaman uji coba zonasi (tautan menyusul)'
  },
  {
    id: 'DOK-03', risetId: 'BRD-2025-005',
    judul: 'Instalasi Modul Biorock Bertenaga Surya di Perairan Pemuteran',
    bidang: 'kelautan', kecamatan: 'gerokgak', tanggal: '2025-06-18',
    narasi: 'Delapan modul biorock dipasang pada kedalaman 5–8 meter di area restorasi seluas 1,8 hektare. Rangka baja dialiri arus rendah dari panel surya terapung untuk mempercepat pengendapan mineral pada permukaan struktur. Pecalang segara Pemuteran dilibatkan sejak tahap perakitan hingga pengawasan rutin, sehingga aturan perlindungan area restorasi dapat dituangkan ke dalam awig-awig desa adat.',
    foto: [
      { src: '/images/dokumentasi/dok-brd005-1.jpg', ket: 'Perakitan rangka modul biorock di pantai' },
      { src: '/images/dokumentasi/dok-brd005-2.jpg', ket: 'Penurunan modul ke area restorasi' },
      { src: '/images/dokumentasi/dok-brd005-3.jpg', ket: 'Pengukuran laju pertumbuhan karang bulanan' },
      { src: '/images/dokumentasi/dok-brd005-4.jpg', ket: 'Panel surya terapung penyuplai arus rendah' }
    ],
    video: null,
    galeriVideo: 'Dokumentasi bawah air area restorasi (tautan menyusul)'
  },
  {
    id: 'DOK-04', risetId: 'BRD-2025-003',
    judul: 'Uji Fermentasi dan Pengeringan Kopi Robusta Wanagiri',
    bidang: 'pertanian', kecamatan: 'sukasada', tanggal: '2025-07-29',
    narasi: 'Eksperimen faktorial tiga metode fermentasi dan tiga durasi pengeringan dijalankan di unit pengolahan Koperasi Tani Sari Gunung. Setiap kombinasi diuji organoleptik oleh panelis bersertifikat Q-Grader untuk mengejar target cupping score di atas 80. Selain protokol teknis, riset ini menyusun identitas merek kolektif agar petani subak abian memperoleh nilai tambah yang lebih besar dibanding menjual ceri gelondongan.',
    foto: [
      { src: '/images/dokumentasi/dok-brd003-1.jpg', ket: 'Proses fermentasi terkontrol di unit koperasi' },
      { src: '/images/dokumentasi/dok-brd003-2.jpg', ket: 'Penjemuran dengan naungan para-para bertingkat' },
      { src: '/images/dokumentasi/dok-brd003-3.jpg', ket: 'Sesi uji organoleptik bersama panelis Q-Grader' }
    ],
    video: null,
    galeriVideo: 'Alur pascapanen kopi robusta (tautan menyusul)'
  },
  {
    id: 'DOK-05', risetId: 'BRD-2025-004',
    judul: 'Stasiun Sensor Peringatan Dini Banjir Sungai Buleleng',
    bidang: 'smartcity', kecamatan: 'buleleng', tanggal: '2025-05-30',
    narasi: 'Enam stasiun sensor ketinggian muka air dipasang dari hulu hingga hilir Sungai Buleleng dan dikalibrasi terhadap AWLR eksisting milik balai wilayah sungai. Data dialirkan ke dashboard BPBD serta memicu pesan siaga ke kelian banjar melalui WhatsApp gateway. Reliabilitas notifikasi diuji lewat simulasi 30 skenario debit sebelum sistem dinyatakan siap operasional bagi 11 banjar di bantaran sungai.',
    foto: [
      { src: '/images/dokumentasi/dok-brd004-1.jpg', ket: 'Pemasangan sensor ultrasonik pada jembatan hulu' },
      { src: '/images/dokumentasi/dok-brd004-2.jpg', ket: 'Kalibrasi pembacaan terhadap AWLR eksisting' },
      { src: '/images/dokumentasi/dok-brd004-3.jpg', ket: 'Simulasi diseminasi peringatan bersama kelian banjar' }
    ],
    video: null,
    galeriVideo: 'Simulasi peringatan dini banjir (tautan menyusul)'
  },
  {
    id: 'DOK-06', risetId: 'BRD-2025-011',
    judul: 'Eksperimen Pewarna Alam untuk Tenun Endek Jinengdalem',
    bidang: 'sosial', kecamatan: 'sawan', tanggal: '2025-08-06',
    narasi: 'Empat belas formula pewarna alam dikembangkan dari flora lokal Buleleng, lalu diuji ketahanan lunturnya mengikuti standar SNI ISO 105. Perajin tenun dilibatkan langsung dalam proses pencelupan agar formula yang dihasilkan dapat direproduksi dengan peralatan yang benar-benar mereka miliki. Katalog desain kontemporer disusun mengikuti preferensi pasar hospitality yang diuji pada 180 responden.',
    foto: [
      { src: '/images/dokumentasi/dok-brd011-1.jpg', ket: 'Ekstraksi bahan pewarna dari flora lokal' },
      { src: '/images/dokumentasi/dok-brd011-2.jpg', ket: 'Proses pencelupan benang bersama perajin' },
      { src: '/images/dokumentasi/dok-brd011-3.jpg', ket: 'Uji ketahanan luntur warna di laboratorium' },
      { src: '/images/dokumentasi/dok-brd011-4.jpg', ket: 'Purwarupa kain endek dengan desain kontemporer' }
    ],
    video: null,
    galeriVideo: 'Proses menenun endek pewarna alam (tautan menyusul)'
  }
];

/* Logo mitra — taruh berkas logo (PNG/SVG transparan disarankan) di
   public/images/mitra/ dengan nama berkas sesuai id di bawah. Selama
   berkas belum ada, kotak logo akan tampil kosong dengan latar polos. */
export const MITRA_LOGO = [
  { id: 'undiksha', logo: '/images/mitra/undiksha.png' },
  { id: 'unud', logo: '/images/mitra/unud.png' },
  { id: 'pnb', logo: '/images/mitra/pnb.png' },
  { id: 'stikom', logo: '/images/mitra/stikom.png' },
  { id: 'unipas', logo: '/images/mitra/unipas.png' },
  { id: 'brin', logo: '/images/mitra/brin.png' },
  { id: 'pemkab', logo: '/images/mitra/pemkab.png' },
  { id: 'bappeda', logo: '/images/mitra/bappeda.png' },
  { id: 'distan', logo: '/images/mitra/distan.png' },
  { id: 'dispar', logo: '/images/mitra/dispar.png' },
  { id: 'dkp', logo: '/images/mitra/dkp.png' },
  { id: 'dekranasda', logo: '/images/mitra/dekranasda.png' }
];
