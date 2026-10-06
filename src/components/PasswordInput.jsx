import { useState } from 'react';
import Icon from './Icon.jsx';

/** Input kata sandi dengan tombol mata untuk menampilkan/menyembunyikan isi. */
export default function PasswordInput({ id, value, onChange, placeholder, autoComplete = 'current-password', className = '' }) {
  const [tampil, setTampil] = useState(false);
  return (
    <div className="relative">
      <input
        id={id} type={tampil ? 'text' : 'password'} autoComplete={autoComplete}
        className={`input-base pr-11 ${className}`}
        value={value} onChange={onChange} placeholder={placeholder}
      />
      <button
        type="button" onClick={() => setTampil((t) => !t)}
        aria-label={tampil ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={tampil}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-3 hover:bg-surface-1 hover:text-ink"
      >
        <Icon name={tampil ? 'eyeOff' : 'eye'} size={16} />
      </button>
    </div>
  );
}
