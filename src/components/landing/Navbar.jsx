import { useEffect, useState } from 'react';
import { ROUTES } from './routes';

const LINKS = [
  ['Overview', '#overview'],
  ['How It Works', '#how-it-works'],
  ['Technology', '#technology'],
  ['Live Simulation', ROUTES.simulation],
  ['Dashboard', ROUTES.dashboard],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`up-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="up-logo" aria-label="Urban Pulse home">
        <span className="up-logo-mark" /> Urban<b>Pulse</b>
      </a>
      <button className="up-burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <nav className={`up-links ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)}>
        {LINKS.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        <a className="up-btn up-btn-primary up-btn-sm" href={ROUTES.simulation}>Launch Simulation</a>
      </nav>
    </header>
  );
}