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
