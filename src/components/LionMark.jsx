/* Logo resmi SINGA RISET BULELENG. Diberi latar putih bulat agar bagian
   hitam (roda gigi & tulisan) tetap terbaca di footer dan sidebar gelap. */
export default function LionMark({ size = 44, className = '' }) {
  return (
    <span
      className={`inline-flex flex-none items-center justify-center overflow-hidden rounded-full bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/images/logo-singa-riset.png"
        alt="Logo SINGA RISET BULELENG"
        width={size}
        height={size}
        className="block h-[92%] w-[92%] object-contain"
        draggable="false"
      />
    </span>
  );
}
