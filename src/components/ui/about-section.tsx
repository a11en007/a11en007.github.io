import React, { useState, useEffect, useRef } from 'react';

const AboutSection = () => {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: '0px',
    top: '0px',
    opacity: 0,
  });
  const [ripples, setRipples] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    const animateWords = () => {
      const wordElements = document.querySelectorAll('.about-word-animate');
      wordElements.forEach(word => {
        const delay = parseInt(word.getAttribute('data-delay')) || 0;
        setTimeout(() => {
          if (word) (word as HTMLElement).style.animation = 'word-appear 0.8s ease-out forwards';
        }, delay);
      });
    };
    const timeoutId = setTimeout(animateWords, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseGradientStyle({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
      });
    };
    const handleMouseLeave = () => {
      setMouseGradientStyle(prev => ({ ...prev, opacity: 0 }));
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const wordElements = document.querySelectorAll('.about-word-animate');
    const handleMouseEnter = (e) => { if (e.target) (e.target as HTMLElement).style.textShadow = '0 0 20px rgba(203, 213, 225, 0.5)'; };
    const handleMouseLeave = (e) => { if (e.target) (e.target as HTMLElement).style.textShadow = 'none'; };
    wordElements.forEach(word => {
      word.addEventListener('mouseenter', handleMouseEnter);
      word.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      wordElements.forEach(word => {
        if (word) {
          word.removeEventListener('mouseenter', handleMouseEnter);
          word.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.floating-element-animate');
    floatingElementsRef.current = Array.from(elements);
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((el, index) => {
          setTimeout(() => {
            if (el) {
              (el as HTMLElement).style.animationPlayState = 'running';
              (el as HTMLElement).style.opacity = '';
            }
          }, (parseFloat((el as HTMLElement).style.animationDelay || "0") * 1000) + index * 100);
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px;
      background-image: radial-gradient(circle, rgba(156, 163, 175, 0.05), rgba(107, 114, 128, 0.05), transparent 70%);
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
    }
    @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
    @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
    .about-word-animate { display: inline-block; opacity: 0; margin: 0 0.1em; transition: color 0.3s ease, transform 0.3s ease; }
    .about-word-animate:hover { color: #cbd5e1; transform: translateY(-2px); }
    .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
    .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: #cbd5e1; animation: underline-grow 2s ease-out forwards; animation-delay: 2s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: float 4s ease-in-out infinite; animation-play-state: paused; }
    @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
    .ripple-effect { position: fixed; width: 4px; height: 4px; background: rgba(203, 213, 225, 0.6); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: pulse-glow 1s ease-out forwards; z-index: 9999; }
    .about-divider { position: absolute; top: 8%; bottom: 8%; left: 50%; width: 4px; background: linear-gradient(to bottom, transparent, #38bdf8 40%, #64748b 60%, transparent); box-shadow: 0 0 16px #38bdf8, 0 0 32px #64748b; border-radius: 9999px; opacity: 0.8; z-index: 20; transition: background 0.3s; }
    @media (max-width: 900px) { .about-divider { display: none; } }
    @media (max-width: 900px) { .about-section-grid { grid-template-columns: 1fr !important; } }
    @media (max-width: 900px) { .about-section-col { border-bottom: 2px solid #64748b; margin-bottom: 2rem; padding-bottom: 2rem; } }
  `;

  return (
    <>
      <style>{pageStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100 font-primary overflow-hidden relative">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="gridReactDarkResponsive" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridReactDarkResponsive)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
          <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
          <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
          <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
          <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
          <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: '4s' }} />
        </svg>

        {/* Responsive Corner Elements */}
        <div className="corner-element-animate top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8" style={{ animationDelay: '4s' }}>
          <div className="absolute top-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8" style={{ animationDelay: '4.2s' }}>
          <div className="absolute top-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8" style={{ animationDelay: '4.4s' }}>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8" style={{ animationDelay: '4.6s' }}>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 opacity-30 rounded-full"></div>
        </div>

        <div className="floating-element-animate" style={{ top: '25%', left: '15%', animationDelay: '0.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '60%', left: '85%', animationDelay: '1s' }}></div>
        <div className="floating-element-animate" style={{ top: '40%', left: '10%', animationDelay: '1.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '75%', left: '90%', animationDelay: '2s' }}></div>

        {/* Split Content - Grid Layout */}
        <div className="relative z-10 min-h-[70vh] w-full grid about-section-grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 items-center justify-center px-4 sm:px-8 md:px-20 py-10 md:py-24">
          {/* Divider */}
          <div className="about-divider" />
          {/* Professional Side */}
          <div className="about-section-col flex flex-col justify-start items-center px-2 md:px-8 h-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extralight leading-tight tracking-tight text-slate-50 text-decoration-animate mb-16 text-center about-word-animate whitespace-nowrap" data-delay="0">Cybersecurity Analyst</h1>
            <div className="max-w-md w-full">
              <div className="w-16 h-0.5 bg-slate-600 mb-8 opacity-60 mx-0" />
              <ul className="list-disc pl-6 mb-8 text-lg text-slate-300 space-y-3 about-word-animate max-w-lg text-left" data-delay="200">
                <li>Hands-on experience simulating real-world attacks to uncover vulnerabilities before adversaries do.</li>
                <li>Skilled in Android and iOS application pentesting, focusing on dynamic and static analysis, API security, and reverse engineering.</li>
                <li>Currently leading a 7-member security team, mentoring analysts, reviewing reports, ensuring project quality, and client satisfaction.</li>
                <li>Committed to helping organizations strengthen their security posture</li>
                <li>Driven by curiosity and continuous learning</li>
              </ul>
              {/* Skills & Certifications */}
              <div className="mb-10 mt-10">
                <h3 className="text-xl md:text-2xl font-extralight leading-tight tracking-tight text-slate-200 text-decoration-animate mb-4 text-left">Certifications</h3>
                <div className="flex flex-wrap gap-3 justify-start">
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium shadow-sm">CRTP</span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium shadow-sm">CEH v11</span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium shadow-sm">PortSwigger Academy <span className="text-xs text-sky-400 ml-1">(In Progress)</span></span>
                </div>
              </div>
              {/* Experience */}
              <div className="mb-10">
                <h3 className="text-xl md:text-2xl font-extralight leading-tight tracking-tight text-slate-200 text-decoration-animate mb-4 text-left">Experience</h3>
                <ul className="list-disc pl-6 text-lg text-slate-300 space-y-2 text-left">
                  <li>Security Analyst VAPT - Team Lead at HackIT Advisory and Services (2023 - Present)</li>
                  <li>VAPT Analyst at Skillmine Technologies (2022 - 2023)</li>
                </ul>
              </div>
              {/* Social Links */}
              <div className="flex gap-6 justify-start mt-8">
                {/* GitHub */}
                <a href="https://github.com/a11en007" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-300 hover:text-sky-400 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.338 4.695-4.566 4.944.36.31.68.92.68 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="https://linkedin.com/in/allen-james-aa755a244" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-300 hover:text-sky-400 transition-colors">
                    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M7 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
                    <path d="M11 16v-3a2 2 0 1 1 4 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M11 13h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </a>
                {/* Resume Download */}
                <a href="/resume.pdf" download className="transition-transform hover:scale-110">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-300 hover:text-sky-400 transition-colors">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="4" y="20" width="16" height="2" rx="1" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Music Side */}
          <div className="about-section-col flex flex-col justify-start items-center px-2 md:px-8 h-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extralight leading-tight tracking-tight text-slate-50 text-decoration-animate mb-16 text-center about-word-animate whitespace-nowrap" data-delay="0">Music Producer</h1>
            <div className="max-w-md w-full">
              <div className="w-16 h-0.5 bg-slate-600 mb-8 opacity-60 mx-0" />
              <ul className="list-disc pl-6 mb-8 text-lg text-slate-300 space-y-3 about-word-animate max-w-lg text-left" data-delay="400">
                <li>Passionate about blending rap and production with raw, emotional soundscapes.</li>
                <li>Produce and arrange tracks across hip-hop, trap, and experimental genres.</li>
                <li>Write and perform original verses, focusing on storytelling and energy.</li>
                <li>Collaborate with artists and vocalists for unique, cross-genre projects.</li>
                <li>Driven by authenticity, late-night creativity, and a love for music technology.</li>
              </ul>
              <div className="mb-10 mt-10">
                <h3 className="text-xl md:text-2xl font-extralight leading-tight tracking-tight text-slate-200 text-decoration-animate mb-4 text-left">Work</h3>
                <ul className="list-disc pl-6 text-lg text-slate-300 space-y-2 text-left">
                  <li>
                    EP1 PADAM
                    <ul className="list-disc pl-6 text-base text-slate-400 space-y-1 mt-2">
                      <li>Paadam</li>
                      <li>Appan</li>
                      <li>Hopelessful</li>
                      <li>Porutho</li>
                      <li>Novv</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div 
          id="mouse-gradient-react"
          className="w-60 h-60 blur-xl sm:w-80 sm:h-80 sm:blur-2xl md:w-96 md:h-96 md:blur-3xl"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        ></div>

        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default AboutSection; 