import React, { useEffect, useState } from 'react';
import { Calendar, Shield, Terminal, Headphones, Music, Sun, Moon, Building, Award, Users, FileText, Linkedin, Github, Instagram, Youtube, Twitter } from 'lucide-react';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('day');
  const [manualTheme, setManualTheme] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!manualTheme) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      
      // Smooth transition starts at 20% scroll and completes at 70% scroll
      const transitionStart = 0.2;
      const transitionEnd = 0.7;
      const transitionProgress = Math.min(Math.max((scrollProgress - transitionStart) / (transitionEnd - transitionStart), 0), 1);
      
      // Smooth color interpolation
      const interpolateColor = (color1: string, color2: string, progress: number) => {
        // Convert hex to RGB for interpolation
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };
      
      // Define day and night colors
      const dayColors = {
        bgPrimary: '#87CEEB',
        bgSecondary: '#FFE4B5',
        textPrimary: '#2D3748',
        textSecondary: '#4A5568',
        accentColor: '#3182CE'
      };
      
      const nightColors = {
        bgPrimary: '#1A1B3A',
        bgSecondary: '#2D1B69',
        textPrimary: '#E2E8F0',
        textSecondary: '#A0AEC0',
        accentColor: '#9F7AEA'
      };
      
      // Interpolate colors
      const currentBgPrimary = interpolateColor(dayColors.bgPrimary, nightColors.bgPrimary, transitionProgress);
      const currentBgSecondary = interpolateColor(dayColors.bgSecondary, nightColors.bgSecondary, transitionProgress);
      const currentTextPrimary = interpolateColor(dayColors.textPrimary, nightColors.textPrimary, transitionProgress);
      const currentTextSecondary = interpolateColor(dayColors.textSecondary, nightColors.textSecondary, transitionProgress);
      const currentAccentColor = interpolateColor(dayColors.accentColor, nightColors.accentColor, transitionProgress);
      
      // Apply interpolated colors to CSS variables
      const root = document.documentElement;
      root.style.setProperty('--bg-primary', currentBgPrimary);
      root.style.setProperty('--bg-secondary', currentBgSecondary);
      root.style.setProperty('--text-primary', currentTextPrimary);
      root.style.setProperty('--text-secondary', currentTextSecondary);
      root.style.setProperty('--accent-color', currentAccentColor);
      root.style.setProperty('--transition-progress', transitionProgress.toString());
      
      // Update card background and shadow with smooth transition
      const cardOpacity = 0.9 - (transitionProgress * 0.1);
      const cardBg = transitionProgress > 0.5 ? 
        `rgba(45, 27, 105, ${0.8 + (transitionProgress - 0.5) * 0.2})` : 
        `rgba(255, 255, 255, ${cardOpacity})`;
      
      const shadowColor = transitionProgress > 0.3 ? 
        `rgba(159, 122, 234, ${0.3 * transitionProgress})` : 
        `rgba(0, 0, 0, ${0.1 * (1 - transitionProgress)})`;
      
      root.style.setProperty('--card-bg', cardBg);
      root.style.setProperty('--shadow-color', shadowColor);
      
      // Set theme for stars visibility
      if (transitionProgress > 0.5) {
        setCurrentTheme('night');
      } else {
        setCurrentTheme('day');
      }
    }
  }, [scrollY, manualTheme]);

  const toggleTheme = () => {
    setManualTheme(true);
    if (currentTheme === 'day') {
      setCurrentTheme('night');
      document.documentElement.setAttribute('data-theme', 'night');
    } else {
      setCurrentTheme('day');
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Reset manual override after 3 seconds
    setTimeout(() => setManualTheme(false), 3000);
  };

  const scrollProgress = Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100);

  return (
    <div className="relative">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass hover:animate-glow transition-all duration-300"
        style={{ color: 'var(--accent-color)' }}
      >
        {currentTheme === 'day' ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      {/* Stars for night mode */}
      {currentTheme === 'night' && (
        <div className="stars">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Landing Section - Professional Theme */}
      <section className="section flex items-center justify-center">
        <div className="section-content text-center">
          <div className="mb-8">
            <div 
              className="w-32 h-32 mx-auto rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center mb-6 shadow-lg"
              style={{ 
                backgroundColor: 'rgba(248, 250, 252, 0.95)',
                borderColor: '#64748b'
              }}
            >
              <Shield size={48} className="text-slate-700" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-light mb-4 text-slate-800">
            Allen Jose James
          </h1>
          
          <p className="text-xl md:text-2xl mb-2 font-medium text-slate-600">
            Cyber Security Analyst
          </p>
          
          <p className="text-lg mb-12 text-slate-500">
            Enterprise Cybersecurity & Risk Management
          </p>
          
          <div className="flex justify-center gap-8 mb-12">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-slate-200">
              <Building size={24} className="text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Enterprise</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-slate-200">
              <Shield size={24} className="text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Security</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-slate-200">
              <Award size={24} className="text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Certified</p>
            </div>
          </div>

          {/* Professional Links */}
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
              <FileText size={20} />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </section>

      {/* Professional Experience Section */}
      <section className="section">
        <div className="section-content">
          <h2 className="text-4xl font-light mb-12 text-center text-slate-800">
            Professional Experience
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <Building size={24} className="text-slate-600 mr-3" />
                <h3 className="text-2xl font-medium text-slate-800">
                  Current Role
                </h3>
              </div>
              <p className="text-lg font-medium mb-2 text-slate-700">
                Chief Information Security Officer
              </p>
              <p className="mb-4 text-slate-600">
                Fortune 500 Financial Services Company
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Leading enterprise security strategy and governance</li>
                <li>• Managing $15M annual cybersecurity budget</li>
                <li>• Overseeing team of 25+ security professionals</li>
                <li>• Board-level risk reporting and compliance oversight</li>
              </ul>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-slate-200">
              <div className="flex items-center mb-4">
                <Award size={24} className="text-slate-600 mr-3" />
                <h3 className="text-2xl font-medium text-slate-800">
                  Certifications
                </h3>
              </div>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>
                  CISSP - Certified Information Systems Security Professional
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>
                  CISM - Certified Information Security Manager
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>
                  CRISC - Certified in Risk and Information Systems Control
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>
                  MBA - Information Systems Management
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-slate-200">
            <div className="flex items-center mb-6">
              <FileText size={24} className="text-slate-600 mr-3" />
              <h3 className="text-2xl font-medium text-slate-800">
                Key Achievements
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-slate-700">15+</div>
                <p className="text-sm text-slate-600">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-slate-700">99.9%</div>
                <p className="text-sm text-slate-600">Security Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-slate-700">$50M+</div>
                <p className="text-sm text-slate-600">Risk Mitigated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section flex items-center justify-center relative">
        <div className="section-content text-center">
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-slate-700">
              As the sun sets...
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800 rounded"></div>
          </div>
          
          <p className="text-xl mt-8 text-slate-600">
            A different side emerges
          </p>
        </div>
      </section>

      <section className="section flex items-center justify-center">
        <div className="section-content text-center animate-fade-in-up">
          <div className="mb-8 animate-float">
            <div 
              className="w-32 h-32 mx-auto rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center mb-6 shadow-xl"
            >
              <Music size={48} className="text-slate-200" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-800">
            Music Producer
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-slate-600">
            Hip-Hop & Electronic Music Creation
          </p>
          
          <div className="flex justify-center mb-8">
            <div className="visualizer">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="visualizer-bar bg-slate-600"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mb-8">
            <Headphones className="animate-pulse-slow text-slate-600" size={32} />
            <Music className="animate-pulse-slow text-slate-600" size={32} />
          </div>

          {/* Music Social Links */}
          <div className="flex justify-center gap-4 mb-12">
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
              <Youtube size={20} />
              <span>YouTube</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
              <Instagram size={20} />
              <span>Instagram</span>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
              <Twitter size={20} />
              <span>Twitter</span>
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                Latest Track
              </h3>
              <p className="text-slate-600">
                "Digital Dreams" - A fusion of cyber aesthetics and hip-hop beats
              </p>
            </div>
            
            <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                Style
              </h3>
              <p className="text-slate-600">
                Tech-rap, cyberpunk influences, lyrical storytelling
              </p>
            </div>
            
            <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold mb-3 text-slate-800">
                Platforms
              </h3>
              <p className="text-slate-600">
                Spotify, SoundCloud, YouTube Music
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-content">
          <h2 className="text-4xl font-bold mb-12 text-center text-slate-800">
            Let's Connect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-8 border border-slate-200">
              <h3 className="text-2xl font-semibold mb-6 text-slate-800">
                Professional Inquiries
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full p-3 rounded bg-white border-2 border-slate-300 focus:border-slate-500 transition-colors text-slate-800"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 rounded bg-white border-2 border-slate-300 focus:border-slate-500 transition-colors text-slate-800"
                />
                <textarea
                  placeholder="Project Details"
                  rows={4}
                  className="w-full p-3 rounded bg-white border-2 border-slate-300 focus:border-slate-500 transition-colors text-slate-800"
                />
                <button className="w-full bg-slate-700 text-white py-3 rounded hover:bg-slate-800 transition-colors font-medium">
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="bg-slate-100 backdrop-blur-sm rounded-lg p-8 border border-slate-200">
              <h3 className="text-2xl font-semibold mb-6 text-slate-800">
                Music Collaborations
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Artist/Producer Name"
                  className="w-full p-3 rounded bg-white border-2 border-slate-300 focus:border-slate-500 transition-colors text-slate-800"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 rounded bg-white border-2 border-slate-300 focus:border-slate-500 transition-colors text-slate-800"
                />
                <textarea
                  placeholder="Collaboration Ideas"
                  rows={4}
                  className="w-full p-3 rounded bg-white border-2 border-slate-300 focus:border-slate-500 transition-colors text-slate-800"
                />
                <button className="w-full bg-slate-700 text-white py-3 rounded hover:bg-slate-800 transition-colors font-medium">
                  Let's Create
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-600">
        <div className="section-content">
          <p className="mb-4">
            © 2024 Allen Jose James - Cyber Security Analyst & Music Producer
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-slate-800 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-slate-800 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-800 transition-colors">YouTube</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
