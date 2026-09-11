import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function NotFound({ message }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[560px] px-5 text-center">
        <Icon name="search" size={52} className="mx-auto mb-5 text-ink-3 opacity-40" />
        <h1 className="mb-2 text-[1.6rem]">Halaman tidak ditemukan</h1>
        <p className="text-ink-2">{message || 'Halaman yang Anda cari tidak tersedia atau telah dipindahkan.'}</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-maroon-800 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-maroon-600">
          Kembali ke beranda
        </Link>
      </div>
    </section>
  );
}
