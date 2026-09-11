/* Inline SVG icon set — no external icon library dependency. */
const PATHS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  arrowDown: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  doc: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  upload: '<path d="M12 17V5M7 9l5-5 5 5"/><path d="M4 20h16"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2"/><path d="M16 5.2A3.2 3.2 0 0119 8.4"/><path d="M17.5 14.6c2.2.5 3.5 2.2 3.5 4.4"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.5 3.1-5.6 7-5.6s7 2.1 7 5.6"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
  money: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 10v4M18 10v4"/>',
  shield: '<path d="M12 3l7.5 3v6c0 4.4-3.1 8-7.5 9-4.4-1-7.5-4.6-7.5-9V6z"/><path d="M9 12l2 2 4-4"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H19v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H19v3H6.5"/>',
  flask: '<path d="M9.5 3v6.2L4.6 18a2 2 0 001.7 3h11.4a2 2 0 001.7-3l-4.9-8.8V3"/><path d="M8.5 3h7M7.4 14h9.2"/>',
  leaf: '<path d="M4 20c0-9 6-15 16-15 0 10-6 15-13 15H4z"/><path d="M4 20c3-5 6.5-8 11-10"/>',
  landmark: '<path d="M3.5 20h17M5 20v-8M10 20v-8M14 20v-8M19 20v-8"/><path d="M12 3l8 5H4z"/>',
  bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
  factory: '<path d="M3 20V9l6 4V9l6 4V6h6v14z"/><path d="M8 20v-4M14 20v-4"/>',
  cpu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M10 3v3.5M14 3v3.5M10 17.5V21M14 17.5V21M3 10h3.5M3 14h3.5M17.5 10H21M17.5 14H21"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  network: '<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="18" r="2.4"/><circle cx="19" cy="18" r="2.4"/><path d="M12 7.4L6.4 15.9M12 7.4l5.6 8.5M7.4 18h9.2"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  lightbulb: '<path d="M9 17.5h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2h5c0-.8.4-1.5 1-2A6 6 0 0012 3z"/>',
  handshake: '<path d="M11 7l-3 3 3 3 2-2 2 2 3-3-3-3z"/><path d="M3 10l5-4h8l5 4-5 8h-8z"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6.5 9-6.5"/>',
  phone: '<path d="M5 3.5h4l2 5-2.5 1.5a12 12 0 005.5 5.5L15.5 13l5 2v4a1.5 1.5 0 01-1.7 1.5A17 17 0 013.5 5.2 1.5 1.5 0 015 3.5z"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-8.5 8.5"/><path d="M18 14v5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 014 19V8a1.5 1.5 0 011.5-1.5H10"/>',
  image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4.5 17l4.5-4 3.5 3 3-2.5 4 3.5"/>',
  video: '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10.5l6-3v9l-6-3z"/>',
  trash: '<path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 13h9l1-13"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3z"/>',
  award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/>',
  refresh: '<path d="M20 11a8 8 0 10-2.3 6.3"/><path d="M20 4v7h-7"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M10.6 6.1A8.6 8.6 0 0112 6c6 0 9.5 6 9.5 6a15.6 15.6 0 01-3 3.6M6.4 7.3A15.5 15.5 0 002.5 12S6 18 12 18c1.4 0 2.6-.3 3.7-.8"/><path d="M9.9 9.9a3 3 0 004.2 4.2"/><path d="M3 3l18 18"/>'
};

export default function Icon({ name, size = 20, className = '' }) {
  const body = PATHS[name] || PATHS.info;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
