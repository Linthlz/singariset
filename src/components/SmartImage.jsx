import { useState } from 'react';

/**
 * Gambar dengan jaring pengaman: selama berkas belum ada di /public/images,
 * komponen menampilkan latar bermotif alih-alih ikon "broken image".
 * Jadi tampilan tetap rapi sebelum gambar asli diunggah.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  seed = 0,
  children
}) {
  const [gagal, setGagal] = useState(!src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {gagal ? (
        <div
          className="absolute inset-0"
          role="img"
          aria-label={alt || 'Gambar belum tersedia'}
          style={{ backgroundImage: 'linear-gradient(140deg,#8E1B1B,#4A0D0D)' }}
        >
          <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <g stroke="rgba(249,199,79,.28)" fill="none" strokeWidth="1">
              <circle cx={70 + (seed % 4) * 40} cy="70" r="52" />
              <circle cx="310" cy="160" r="70" />
              <path d="M0 185L100 125L200 165L300 95L400 145" />
            </g>
            <g fill="rgba(249,199,79,.5)">
              <circle cx="100" cy="125" r="4" /><circle cx="200" cy="165" r="5" /><circle cx="300" cy="95" r="4" />
            </g>
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setGagal(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
      {children}
    </div>
  );
}
