import { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import Solution from '../components/landing/Solution';
import SmartTile from '../components/landing/SmartTile';
import HowItWorks from '../components/landing/HowItWorks';
import Technology from '../components/landing/Technology';
import Features from '../components/landing/Features';
import CTA from '../components/landing/CTA';
import '../styles/landing.css';

export default function LandingPage() {
  // Scroll-reveal for every element marked .rv
  useEffect(() => {
    const els = document.querySelectorAll('.up-landing .rv');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <div className="up-landing">
      <Navbar />
      <main>
        <Hero /><Problem /><Solution /><SmartTile /><HowItWorks /><Technology /><Features /><CTA />
      </main>
    </div>
  );
}