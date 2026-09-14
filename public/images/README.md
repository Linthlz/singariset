# Folder Gambar — SINGA RISET BULELENG

Taruh gambar Anda di folder ini. Semua gambar dipanggil lewat path absolut
(`/images/...`) sehingga **tidak perlu menulis `import` apa pun di kode**.
Cukup salin berkasnya, lalu muat ulang halaman.

Bila sebuah gambar belum ada, tampilan **tidak akan rusak** — komponen
`SmartImage` otomatis menampilkan latar bermotif sebagai pengganti.

---

## 1. Hero beranda (slider otomatis 7 detik)

Folder: `public/images/hero/`

| Berkas yang dicari | Dipakai untuk |
|---|---|
| `hero-1.jpg` | Slide 1 |
| `hero-2.jpg` | Slide 2 |
| `hero-3.jpg` | Slide 3 |
| `hero-4.jpg` | Slide 4 |

- Rasio ideal **16:9**, ukuran minimal **1920 × 1080 px**.
- Format `.jpg` / `.webp`, usahakan < 400 KB per gambar agar halaman tetap cepat.
- Teks judul ditaruh di atas gambar, jadi pilih foto yang bagian kiri-nya
  tidak terlalu ramai.

**Menambah / mengganti judul tiap slide:** buka `src/data/heroSlides.js`.
Di sana tiap slide punya `gambar`, `judul`, `sorot`, dan `teks`.
Tambah atau kurangi entri sesuka Anda — slider menyesuaikan otomatis.

---

## 2. Latar footer

Folder: `public/images/footer/`
Berkas: `footer-bg.jpg`

- Rasio lebar (panorama), minimal **1920 × 800 px**.
- Akan ditimpa overlay gelap merah marun, jadi foto terang pun tetap aman.

---

## 3. Gambar berita

Folder: `public/images/berita/`
Nama berkas mengikuti kolom `gambar` pada `BERITA` di `src/data/singaData.js`,
contoh: `berita-01.jpg`, `berita-02.jpg`, dan seterusnya.

Rasio **16:9**, minimal **1200 × 675 px**.

---

## 4. Dokumentasi publikasi riset

Folder: `public/images/dokumentasi/`
Nama berkas mengikuti kolom `foto` pada `DOKUMENTASI` di
`src/data/singaData.js`, contoh: `dok-brd001-1.jpg`.

Rasio bebas (ditampilkan sebagai galeri), minimal lebar **1000 px**.

Untuk **video**, tidak perlu unggah berkas — cukup isi kolom `video` pada
`DOKUMENTASI` dengan tautan YouTube, lalu video tampil sebagai pemutar sematan.

---

## 5. Foto profil empat pilar (kartu yang bisa dibalik)

Folder: `public/images/profil/`

| Berkas yang dicari | Dipakai untuk |
|---|---|
| `kolaborasi.jpg` | Kartu pilar Kolaborasi |
| `inovasi.jpg` | Kartu pilar Inovasi |
| `data.jpg` | Kartu pilar Data |
| `dampak.jpg` | Kartu pilar Dampak |

- Rasio **potret** (3:4), minimal **800 × 1000 px** — kartu berbentuk tinggi.
- Bagian bawah foto tertutup gradasi gelap untuk judul, jadi hindari objek
  penting di area tersebut.
- Saat kursor di atas kartu (atau kartu diklik di layar sentuh), kartu berbalik
  dan menampilkan narasi pilar tersebut.

---

## 6. Foto kegiatan peta jalan riset

Folder: `public/images/roadmap/`

| Berkas yang dicari | Dipakai untuk |
|---|---|
| `2025.jpg` … `2029.jpg` | Kartu tahapan peta jalan per tahun |

- Rasio **potret** (3:4), minimal **800 × 1000 px**.
- Judul tahun dan tema ditaruh di bagian atas foto, narasi program di bagian
  bawah — keduanya di atas gradasi gelap.
- Narasi dan indikator tiap tahun diatur pada `ROADMAP` di
  `src/data/singaData.js`.

---

## 6a. Dokumen resmi peta jalan (halaman Peta Jalan Riset)

Folder: `public/images/peta-jalan/`
Berkas: `dokumen.jpg`

- Foto atau hasil pindai (scan) bagan resmi peta jalan riset terbitan BRIDA.
- Rasio bebas (lebar/panorama lebih disarankan), usahakan resolusi tinggi
  agar teks pada bagan tetap terbaca saat diperbesar.
- Gambar ditampilkan utuh tanpa dipotong (`object-contain`) di bagian atas
  halaman `/roadmap`, sebelum garis waktu tahunan.

---

## 7. Logo mitra (baris berjalan otomatis)

Folder: `public/images/mitra/`

Nama berkas mengikuti kolom `logo` pada `MITRA_LOGO` di
`src/data/singaData.js`, contoh: `undiksha.png`, `unud.png`, `brin.png`.

- Format **PNG/SVG berlatar transparan**, tinggi minimal **200 px**.
- Hanya logo, tanpa teks tambahan — nama lembaga tidak ditampilkan.
