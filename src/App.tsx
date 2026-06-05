import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUpRight, Sun, Moon, Mail, Github, Linkedin, Sparkles,
  ChevronDown, Shield, Lock, Zap, Eye, Cpu, BookOpen, Target, Rocket, GraduationCap, Lightbulb, Code2
} from 'lucide-react';

/* ────────────────────────────────────────────
   HOOKS
   ──────────────────────────────────────────── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

function useCounter(target: number, duration: number, start: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, decimals]);
  return value;
}

/* ────────────────────────────────────────────
   SHARED COMPONENTS
   ──────────────────────────────────────────── */

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function HeroReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      className={`transition-all duration-[900ms] ${className} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
    >
      {children}
    </div>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || 'ontouchstart' in window) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
    };
    const leave = () => { el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, []);
  return <div ref={ref} className="inline-block transition-transform duration-300 ease-out">{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-['JetBrains_Mono'] text-xs tracking-[0.28em] uppercase text-[#3B5973] mb-5">{children}</p>;
}

/* ────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'contact', label: 'Contact' },
];

const PROJECTS = [
  {
    id: 1, num: '01', name: 'CodePanel AI', featured: true, link: 'https://codepanel-ai.vercel.app/',
    tagline: 'An AI-powered code security & compliance analysis platform that helps developers analyze source code for vulnerabilities, privacy risks, and performance bottlenecks using a multi-agent review system.',
    description: 'Instead of generating code, CodePanel AI focuses on helping developers understand, evaluate, and improve the quality of their software.',
    stack: ['AI', 'React', 'TypeScript', 'LLM', 'Security'],
    learned: ['AI-powered workflows', 'Software architecture', 'Security concepts', 'Performance optimization', 'Developer tooling', 'Problem-solving at scale'],
    metrics: { devTime: '6 weeks', features: '5 Agents', complexity: 'Advanced' },
  },
  {
    id: 2, num: '02', name: 'MovieHub', featured: false, link: 'https://muzafer26.github.io/MovieHub/',
    tagline: 'A movie discovery platform that allows users to explore films, ratings, cast information, and streaming details using the TMDB API.',
    stack: ['TypeScript', 'React', 'TMDB API'],
    learned: ['API integration', 'State management', 'Frontend architecture', 'UX design'],
  },
  {
    id: 3, num: '03', name: 'CampusOnboard', featured: false, link: 'https://campusonboard.vercel.app/',
    tagline: 'A digital college admission platform designed to simplify the admission process through online document submission, verification, and management.',
    stack: ['React', 'Firebase'],
    learned: ['Authentication systems', 'Cloud databases', 'Real-world workflow design', 'User management'],
  },
  {
    id: 4, num: '04', name: 'ScholarSync', featured: false, link: 'https://scholar-sync-puce.vercel.app/',
    tagline: 'A centralized student resource platform that helps users discover scholarships, career opportunities, and learning resources.',
    stack: ['TypeScript', 'React'],
    learned: ['Information architecture', 'Data organization', 'User-centric design'],
  },
];

const SKILL_GROUPS = [
  { label: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript'] },
  { label: 'Frontend', skills: ['React', 'HTML', 'CSS', 'Tailwind'] },
  { label: 'Backend & Cloud', skills: ['Firebase', 'REST APIs', 'Vercel', 'Cloudflare'] },
  { label: 'Tools', skills: ['Git', 'GitHub', 'Figma', 'VS Code'] },
  { label: 'Core CS', skills: ['Data Structures', 'DBMS', 'OS', 'Networks', 'Software Engineering'] },
];

const COURSES = [
  'Data Structures & Algorithms', 'Database Management Systems', 'Operating Systems',
  'Computer Networks', 'Software Engineering', 'Machine Learning', 'NLP', 'Cloud Computing',
];

const LEARNING_AREAS = [
  'Data Structures & Algorithms', 'System Design Fundamentals', 'Database Optimization',
  'Backend Development', 'Machine Learning Fundamentals', 'Natural Language Processing',
  'AI-Assisted Development Workflows', 'Cloud Technologies', 'Software Architecture',
];

const TECH_MARQUEE = ['TypeScript', 'React', 'Python', 'Machine Learning', 'NLP', 'Firebase', 'Git', 'Figma', 'Cloud Computing'];

const SVG_ICONS: Record<string, string> = {
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
  movie: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>',
  campus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>',
  scholar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
};

const PROJECT_ICON_MAP: Record<string, string> = {
  'CodePanel AI': 'ai', 'MovieHub': 'movie', 'CampusOnboard': 'campus',
  'ScholarSync': 'scholar',
};

/* ────────────────────────────────────────────
   MAIN APP
   ──────────────────────────────────────────── */

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeNav, setActiveNav] = useState('');
  const [statsVisible, setStatsVisible] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  const cgpi = useCounter(8.86, 1800, statsVisible, 2);
  const projectCount = useCounter(4, 1400, statsVisible, 0);

  useEffect(() => { document.documentElement.classList.toggle('dark', isDark); }, [isDark]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavHidden(y > 120 && y > lastScrollY.current);
      lastScrollY.current = y;
      const sections = document.querySelectorAll<HTMLElement>('section[data-section]');
      let current = '';
      sections.forEach(s => { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.dataset.section || ''; });
      setActiveNav(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = document.querySelector('[data-section="about"]');
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const dk = isDark;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${dk ? 'bg-[#0a0a0f] text-white' : 'bg-[#EAEAEA] text-[#333]'}`}>

      <LoadingScreen />
      <CustomCursor />

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 rounded-full border px-2 py-2 transition-all duration-500 ${
        navHidden ? '-translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      } ${dk ? 'bg-[#0a0a0f]/80 border-white/10' : 'bg-[#EAEAEA]/80 border-[#E5E7EB]'} backdrop-blur-xl shadow-lg`}>
        <button onClick={() => scrollTo('hero')} className={`font-['Space_Grotesk'] text-sm font-bold px-3 py-1 rounded-full transition-colors ${dk ? 'text-white hover:bg-white/10' : 'text-[#333] hover:bg-black/5'}`}>Muzafer</button>
        <div className="hidden lg:flex gap-0.5 mx-1">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className={`font-['Inter'] text-[11px] font-medium uppercase tracking-[0.18em] px-3 py-1.5 rounded-full transition-all duration-200 ${
              activeNav === item.id ? dk ? 'bg-white/10 text-white' : 'bg-[#F5F5F5] text-[#333]' : dk ? 'text-white/40 hover:text-white/70' : 'text-[#9CA3AF] hover:text-[#333]'
            }`}>{item.label}</button>
          ))}
        </div>
        <button onClick={() => setIsDark(d => !d)} className={`p-1.5 rounded-full transition-colors ${dk ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} aria-label="Toggle theme">
          {dk ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#3B5973]" />}
        </button>
        <button onClick={() => scrollTo('contact')} className={`font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full px-4 py-2 transition-opacity hover:opacity-85 ${dk ? 'bg-white text-[#0a0a0f]' : 'bg-[#333] text-[#EAEAEA]'}`}>Hire Me</button>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" data-section="hero" className="relative min-h-screen flex items-center overflow-hidden">
        <div className={`absolute inset-0 ${dk ? 'bg-[#0a0a0f]' : 'bg-[#EAEAEA]'}`} />
        <div className={`absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 animate-float ${dk ? 'bg-[#3B5973]' : 'bg-[#3B5973]/30'}`} />
        <div className={`absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 animate-pulse ${dk ? 'bg-purple-800' : 'bg-purple-400/30'}`} />

        <div className="relative w-full max-w-[1280px] mx-auto px-6 md:px-12 py-32 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">
          <div>
            <HeroReveal delay={200}>
              <p className="font-['JetBrains_Mono'] text-xs tracking-[0.28em] uppercase text-[#3B5973] mb-7">
                TCET Mumbai · 2024–2027
              </p>
            </HeroReveal>
            <h1 className="font-['Space_Grotesk'] leading-[0.95] tracking-[-0.04em] mb-8">
              <HeroReveal delay={400}>
                <span className={`block text-[clamp(72px,9vw,132px)] font-bold ${dk ? 'text-white' : 'text-[#333]'}`}>Muzafer</span>
              </HeroReveal>
              <HeroReveal delay={550}>
                <span className="block text-[clamp(72px,9vw,132px)] font-bold text-[#3B5973]">Shaikh.</span>
              </HeroReveal>
            </h1>
            <HeroReveal delay={800}>
              <p className={`font-['Inter'] text-lg leading-[1.7] max-w-[520px] mb-10 ${dk ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                I enjoy building software, solving problems, and exploring how Artificial Intelligence can improve the way we learn, create, and develop technology. My long-term goal is to work in AI and Machine Learning while maintaining a strong foundation in software engineering.
              </p>
            </HeroReveal>
            <HeroReveal delay={1000}>
              <div className="flex gap-4 mb-12">
                <MagneticButton><button onClick={() => scrollTo('spotlight')} className={`font-['Inter'] text-sm font-semibold uppercase tracking-[0.08em] rounded-full px-8 py-4 transition-transform hover:-translate-y-0.5 ${dk ? 'bg-white text-[#0a0a0f]' : 'bg-[#333] text-[#EAEAEA]'}`}>View Work</button></MagneticButton>
                <MagneticButton><button onClick={() => scrollTo('contact')} className={`font-['Inter'] text-sm font-semibold uppercase tracking-[0.08em] rounded-full px-8 py-4 border-[1.5px] transition-transform hover:-translate-y-0.5 ${dk ? 'border-white/20 text-white hover:border-white/40' : 'border-[#E5E7EB] text-[#333] hover:border-[#333]'}`}>Get in Touch</button></MagneticButton>
              </div>
            </HeroReveal>
            <HeroReveal delay={1200}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-px ${dk ? 'bg-white/20' : 'bg-[#BFC5CA]'}`} />
                <span className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.24em] uppercase ${dk ? 'text-white/30' : 'text-[#9CA3AF]'}`}>Scroll to explore</span>
                <ChevronDown className={`w-4 h-4 animate-bounce ${dk ? 'text-white/30' : 'text-[#9CA3AF]'}`} />
              </div>
            </HeroReveal>
          </div>
          <HeroReveal delay={600} className="hidden lg:block">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#3B5973]/30 to-purple-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <img src="https://muzafer26.shaikhmuzafer10.workers.dev/Muzafer.jpeg" alt="Muzafer Shaikh" className="relative w-full h-[520px] object-cover object-top rounded-2xl grayscale-[8%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]" />
              <div className={`absolute bottom-6 -left-6 rounded-full px-5 py-2.5 backdrop-blur-md border font-['JetBrains_Mono'] text-[11px] tracking-[0.2em] uppercase ${dk ? 'bg-[#0a0a0f]/80 border-white/10 text-white/50' : 'bg-[#F5F5F5]/90 border-[#E5E7EB] text-[#9CA3AF]'}`}>
                Building · Learning · Shipping
              </div>
            </div>
          </HeroReveal>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 border-t border-b overflow-hidden py-3.5 ${dk ? 'border-white/5' : 'border-[#E5E7EB]'}`}>
          <div className="flex animate-marquee whitespace-nowrap">
            {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, i) => (
              <span key={i} className={`flex items-center gap-6 px-8 font-['JetBrains_Mono'] text-xs tracking-[0.24em] uppercase ${dk ? 'text-white/25' : 'text-[#9CA3AF]'}`}>
                {tech}<span className={`w-1 h-1 rounded-full ${dk ? 'bg-white/10' : 'bg-[#BFC5CA]'}`} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" data-section="about" className={`relative py-24 ${dk ? 'bg-[#111118]' : 'bg-[#F5F5F5]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <RevealSection><SectionLabel>About</SectionLabel></RevealSection>
              <RevealSection delay={100}>
                <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 ${dk ? 'text-white' : 'text-[#333]'}`}>
                  I build things,<br /><em className="text-[#3B5973] not-italic">then ship them.</em>
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <div className={`font-['Inter'] text-lg leading-[1.75] mb-6 space-y-5 ${dk ? 'text-white/60' : 'text-[#333]'}`}>
                  <p>Hello, I'm Muzafer. I'm currently pursuing my BCA at <strong>TCET Mumbai</strong>, where I'm building a strong foundation in computer science through subjects such as Database Management Systems, Operating Systems, Computer Networks, Software Engineering, and Machine Learning.</p>
                  <p>My journey into technology started with curiosity about how websites and applications work. What began as learning basic programming gradually evolved into building complete projects, exploring modern development workflows, and understanding how software solves real-world problems.</p>
                  <p>Today, I enjoy working across web development, software engineering, and AI-powered applications. I spend a significant amount of time building projects because I believe practical experience is one of the best ways to learn.</p>
                  <p>One area that particularly interests me is the intersection of <strong>Artificial Intelligence and Software Development</strong>. AI has transformed the way developers learn, prototype, and build products. Rather than viewing AI as a replacement for developers, I see it as a powerful collaborator that helps accelerate learning and productivity.</p>
                  <p>At the same time, I strongly believe that understanding the fundamentals remains essential. Technologies change rapidly, but concepts such as algorithms, databases, networking, and software architecture continue to form the foundation of great engineering.</p>
                  <p className={`font-semibold ${dk ? 'text-white' : 'text-[#333]'}`}>My approach is simple: <em className="text-[#3B5973] not-italic">Learn continuously. Build consistently. Improve constantly.</em></p>
                </div>
              </RevealSection>
              <RevealSection delay={300}>
                <div className={`grid grid-cols-2 gap-px rounded-lg overflow-hidden border ${dk ? 'bg-white/5 border-white/5' : 'bg-[#E5E7EB] border-[#E5E7EB]'}`}>
                  {[
                    { value: cgpi.toFixed(2), label: 'Current CGPI' },
                    { value: `${projectCount}+`, label: 'Shipped Projects' },
                    { value: '3yr', label: 'BCA @ TCET' },
                    { value: '∞', label: 'Curiosity' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-7 ${dk ? 'bg-[#111118]' : 'bg-[#F5F5F5]'}`}>
                      <div className={`font-['Space_Grotesk'] text-[42px] font-bold tracking-[-0.03em] leading-none mb-1.5 ${dk ? 'text-white' : 'text-[#333]'}`}>{stat.value}</div>
                      <div className={`font-['Inter'] text-xs font-medium tracking-[0.12em] uppercase ${dk ? 'text-white/30' : 'text-[#9CA3AF]'}`}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>

            <div className="space-y-12">
              <RevealSection delay={200}>
                <h3 className={`font-['Space_Grotesk'] text-[27px] font-semibold mb-4 ${dk ? 'text-white' : 'text-[#333]'}`}>What I'm Currently Learning</h3>
                <p className={`font-['Inter'] text-base leading-[1.65] mb-6 ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>
                  My current focus is on strengthening both software engineering fundamentals and AI-related skills. I enjoy learning by building projects because projects expose challenges that tutorials often don't.
                </p>
                <div className="flex flex-wrap gap-2">
                  {LEARNING_AREAS.map(c => (
                    <span key={c} className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.14em] uppercase rounded-full px-4 py-2 border ${dk ? 'bg-white/5 text-white/60 border-white/10' : 'bg-[#EAEAEA] text-[#333] border-[#E5E7EB]'}`}>{c}</span>
                  ))}
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education" data-section="education" className={`relative py-24 ${dk ? 'bg-[#0a0a0f]' : 'bg-[#EAEAEA]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <RevealSection><SectionLabel>Education</SectionLabel></RevealSection>
          <RevealSection delay={100}>
            <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-16 ${dk ? 'text-white' : 'text-[#333]'}`}>
              Where I <em className="text-[#3B5973] not-italic">learn.</em>
            </h2>
          </RevealSection>
          <RevealSection delay={200}>
            <div className={`rounded-lg border p-10 relative overflow-hidden ${dk ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white/60 border-[#E5E7EB]'}`}>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#3B5973]/5 rounded-full blur-3xl" />
              <div className="flex items-start gap-6 mb-8">
                <div className={`p-4 rounded-xl ${dk ? 'bg-[#3B5973]/15' : 'bg-[#3B5973]/10'}`}>
                  <GraduationCap className="w-8 h-8 text-[#3B5973]" />
                </div>
                <div>
                  <h3 className={`font-['Space_Grotesk'] text-2xl font-semibold mb-1 ${dk ? 'text-white' : 'text-[#333]'}`}>Thakur College of Engineering and Technology</h3>
                  <p className={`font-['Inter'] text-base ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>Mumbai, India</p>
                </div>
              </div>
              <div className="mb-8">
                <p className={`font-['Inter'] text-lg font-semibold mb-2 ${dk ? 'text-white' : 'text-[#333]'}`}>Bachelor of Computer Applications (BCA)</p>
                <p className={`font-['JetBrains_Mono'] text-sm ${dk ? 'text-white/30' : 'text-[#BFC5CA]'}`}>2024 – 2027</p>
              </div>
              <div>
                <p className={`font-['Inter'] text-xs font-semibold tracking-[0.12em] uppercase mb-4 ${dk ? 'text-white/30' : 'text-[#9CA3AF]'}`}>Relevant Areas of Study</p>
                <div className="flex flex-wrap gap-2">
                  {COURSES.map(c => (
                    <span key={c} className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.14em] uppercase rounded-full px-4 py-2 border ${dk ? 'bg-white/5 text-white/60 border-white/10' : 'bg-[#EAEAEA] text-[#333] border-[#E5E7EB]'}`}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── CODEPANEL AI SPOTLIGHT ── */}
      <section id="spotlight" data-section="spotlight" className={`relative py-24 overflow-hidden ${dk ? 'bg-[#111118]' : 'bg-[#F5F5F5]'}`}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`absolute w-1 h-1 rounded-full animate-particle ${dk ? 'bg-[#3B5973]/40' : 'bg-[#3B5973]/20'}`}
              style={{ left: `${(i * 5.3) % 100}%`, top: `${(i * 7.1) % 100}%`, animationDelay: `${i * 0.3}s`, animationDuration: `${3 + (i % 4)}s` }} />
          ))}
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12">
          <RevealSection>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#3B5973]" />
              <span className="font-['JetBrains_Mono'] text-xs tracking-[0.28em] uppercase text-[#3B5973]">Featured Project</span>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-4 ${dk ? 'text-white' : 'text-[#333]'}`}>
              CodePanel <em className="text-[#3B5973] not-italic">AI</em>
            </h2>
            <p className={`font-['Inter'] text-lg leading-[1.6] max-w-[700px] mb-4 ${dk ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
              AI-Powered Code Security & Compliance Analysis Platform
            </p>
            <p className={`font-['Inter'] text-base leading-[1.7] max-w-[800px] mb-12 ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>
              CodePanel AI is one of the most ambitious projects I've built. The platform helps developers analyze source code for security vulnerabilities, privacy risks, performance bottlenecks, compliance concerns, and maintainability issues using an AI-powered multi-agent review system.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Why I Built It', icon: <Lightbulb className="w-5 h-5" />, text: 'Many projects focus heavily on functionality but overlook critical aspects such as security, privacy, compliance, performance, and maintainability. I wanted to explore whether AI could help developers identify these issues earlier in the development process.' },
              { title: 'Security Auditor', icon: <Shield className="w-5 h-5" />, text: 'Analyzes source code to identify potential vulnerabilities, insecure coding practices, sensitive information exposure, and security-related risks.' },
              { title: 'Privacy Shield', icon: <Lock className="w-5 h-5" />, text: 'Reviews code for data handling concerns, privacy risks, GDPR-related considerations, and sensitive information management.' },
              { title: 'Performance Engineer', icon: <Zap className="w-5 h-5" />, text: 'Detects inefficient operations, database query issues, potential bottlenecks, and scalability concerns.' },
              { title: 'Code Quality', icon: <Eye className="w-5 h-5" />, text: 'Evaluates readability, maintainability, technical debt, and clean code practices across the codebase.' },
              { title: 'Multi-Agent System', icon: <Cpu className="w-5 h-5" />, text: 'Uses multiple specialized analysis perspectives to provide comprehensive insights into software quality from every angle.' },
            ].map((item, i) => (
              <RevealSection key={item.title} delay={150 + i * 80}>
                <div className={`group p-6 rounded-lg border transition-all duration-300 hover:-translate-y-1 h-full ${dk ? 'bg-white/[0.03] border-white/[0.06] hover:border-[#3B5973]/40 hover:bg-white/[0.05]' : 'bg-white/60 border-[#E5E7EB] hover:border-[#3B5973]/30 hover:bg-white'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#3B5973]">{item.icon}</span>
                    <h4 className={`font-['Space_Grotesk'] text-lg font-semibold ${dk ? 'text-white' : 'text-[#333]'}`}>{item.title}</h4>
                  </div>
                  <p className={`font-['Inter'] text-sm leading-[1.7] ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>{item.text}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          <RevealSection delay={600}>
            <div className={`p-6 rounded-lg border-l-[3px] border-l-[#3B5973] ${dk ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white/60 border border-[#E5E7EB]'}`}>
              <p className="font-['JetBrains_Mono'] text-[11px] tracking-[0.2em] uppercase text-[#3B5973] mb-3">What I Learned</p>
              <div className="flex flex-wrap gap-2">
                {PROJECTS[0].learned!.map(skill => (
                  <span key={skill} className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.12em] uppercase rounded-full px-3 py-1.5 border ${dk ? 'bg-[#3B5973]/10 text-[#3B5973] border-[#3B5973]/20' : 'bg-[#3B5973]/8 text-[#3B5973] border-[#3B5973]/15'}`}>{skill}</span>
                ))}
              </div>
              <p className={`font-['Inter'] text-sm mt-4 mb-6 ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>
                More importantly, it reinforced my belief that AI works best when combined with strong engineering fundamentals.
              </p>
              <a href="https://codepanel-ai.vercel.app/" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 font-['Inter'] text-sm font-semibold uppercase tracking-[0.08em] rounded-full px-6 py-3 transition-all hover:opacity-85 hover:-translate-y-0.5 ${dk ? 'bg-white text-[#0a0a0f]' : 'bg-[#333] text-[#EAEAEA]'}`}>
                <Sparkles className="w-4 h-4" /> Live Demo <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" data-section="projects" className={`relative py-24 ${dk ? 'bg-[#0a0a0f]' : 'bg-[#EAEAEA]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-14">
            <div>
              <RevealSection><SectionLabel>Other Projects</SectionLabel></RevealSection>
              <RevealSection delay={100}>
                <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] ${dk ? 'text-white' : 'text-[#333]'}`}>
                  Things I've <em className="text-[#3B5973] not-italic">shipped.</em>
                </h2>
              </RevealSection>
            </div>
            <RevealSection delay={200}>
              <span className={`font-['Space_Grotesk'] text-[78px] font-semibold tracking-[0.03em] leading-none ${dk ? 'text-white/5' : 'text-[#E5E7EB]'}`}>03</span>
            </RevealSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded overflow-hidden border" style={{ backgroundColor: dk ? 'rgba(255,255,255,0.03)' : '#E5E7EB', borderColor: dk ? 'rgba(255,255,255,0.05)' : '#E5E7EB' }}>
            {PROJECTS.filter(p => !p.featured).map((project, idx) => (
              <RevealSection key={project.id} delay={idx * 80}>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className={`group block p-10 transition-all duration-300 ${dk ? 'bg-[#0a0a0f] hover:bg-[#0f0f18]' : 'bg-[#EAEAEA] hover:bg-white'}`}>
                  <span className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.2em] uppercase block mb-6 ${dk ? 'text-white/20' : 'text-[#BFC5CA]'}`}>{project.num} / 04</span>
                  <div className={`mb-5 w-10 h-10 ${dk ? 'text-white/50' : 'text-[#3B5973]'}`} dangerouslySetInnerHTML={{ __html: SVG_ICONS[PROJECT_ICON_MAP[project.name]] }} />
                  <h3 className={`font-['Space_Grotesk'] text-[28px] font-semibold tracking-[-0.02em] mb-2 group-hover:text-[#3B5973] transition-colors duration-300 ${dk ? 'text-white' : 'text-[#333]'}`}>{project.name}</h3>
                  <p className={`font-['Inter'] text-[15px] leading-[1.5] mb-6 ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>{project.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.stack.map(tech => <span key={tech} className="font-['JetBrains_Mono'] text-[10px] tracking-[0.14em] uppercase text-[#3B5973] bg-[#3B5973]/8 border border-[#3B5973]/15 rounded-full px-3 py-1">{tech}</span>)}
                  </div>
                  {project.learned && (
                    <div className={`mb-6 ${dk ? 'border-white/[0.04]' : ''} border-t pt-5`}>
                      <p className={`font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] uppercase mb-3 ${dk ? 'text-white/25' : 'text-[#BFC5CA]'}`}>What I Learned</p>
                      <div className="flex flex-wrap gap-2">
                        {project.learned.map(l => <span key={l} className={`font-['Inter'] text-xs ${dk ? 'text-white/35' : 'text-[#9CA3AF]'}`}>{l}</span>).reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`d${i}`} className={dk ? 'text-white/15' : 'text-[#BFC5CA]'}>·</span>, el], [])}
                      </div>
                    </div>
                  )}
                  <span className="flex items-center gap-2 font-['Inter'] text-[13px] font-medium tracking-[0.08em] uppercase text-current group-hover:text-[#3B5973] transition-colors">
                    View Project <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </a>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" data-section="skills" className={`relative py-24 ${dk ? 'bg-[#111118]' : 'bg-[#F5F5F5]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <RevealSection><SectionLabel>Skills</SectionLabel></RevealSection>
              <RevealSection delay={100}>
                <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 ${dk ? 'text-white' : 'text-[#333]'}`}>
                  Built with <em className="text-[#3B5973] not-italic">intent.</em>
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <p className={`font-['Inter'] text-lg leading-[1.75] mb-10 ${dk ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                  Comfortable across the stack today, with a long-term bet on Machine Learning and NLP.
                </p>
              </RevealSection>
              <RevealSection delay={300}>
                <div className={`p-6 rounded border-l-[3px] border-l-[#3B5973] ${dk ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-[#F5F5F5] border border-[#E5E7EB]'}`}>
                  <p className="font-['JetBrains_Mono'] text-[11px] tracking-[0.2em] uppercase text-[#3B5973] mb-2.5">Long-Term Focus</p>
                  <h3 className={`font-['Space_Grotesk'] text-xl font-semibold mb-2 ${dk ? 'text-white' : 'text-[#333]'}`}>Machine Learning · NLP</h3>
                  <p className={`font-['Inter'] text-[15px] leading-[1.6] ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>Where computation starts to feel like comprehension. That's where I want to live.</p>
                </div>
              </RevealSection>
            </div>
            <div className="space-y-7">
              {SKILL_GROUPS.map((group, idx) => (
                <RevealSection key={group.label} delay={100 + idx * 80}>
                  <p className={`font-['Inter'] text-xs font-semibold tracking-[0.12em] uppercase mb-3 ${dk ? 'text-white/20' : 'text-[#BFC5CA]'}`}>{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map(skill => (
                      <span key={skill} className={`font-['JetBrains_Mono'] text-[13px] tracking-[0.05em] rounded-full px-4 py-2 border transition-all duration-200 cursor-default hover:border-[#3B5973] hover:text-[#3B5973] ${dk ? 'bg-white/[0.04] text-white/70 border-white/[0.08]' : 'bg-[#EAEAEA] text-[#333] border-[#E5E7EB]'}`}>{skill}</span>
                    ))}
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MY APPROACH TO AI ── */}
      <section className={`relative py-24 ${dk ? 'bg-[#0a0a0f]' : 'bg-[#EAEAEA]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <RevealSection><SectionLabel>My Approach to AI</SectionLabel></RevealSection>
              <RevealSection delay={100}>
                <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 ${dk ? 'text-white' : 'text-[#333]'}`}>
                  AI as a <em className="text-[#3B5973] not-italic">collaborator,</em><br />not a replacement.
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <p className={`font-['Inter'] text-lg leading-[1.7] mb-8 ${dk ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                  Artificial Intelligence has changed the way I learn and build software. However, I believe AI should enhance understanding rather than replace it.
                </p>
              </RevealSection>
              <RevealSection delay={300}>
                <p className={`font-['Inter'] text-base leading-[1.7] ${dk ? 'text-white/60' : 'text-[#333]'}`}>
                  My goal is not simply to use AI tools. My goal is to become an engineer who understands how these systems work and how they can be applied responsibly to solve meaningful problems.
                </p>
              </RevealSection>
            </div>
            <div>
              <RevealSection delay={200}>
                <div className="space-y-4">
                  {[
                    'Explore new technologies',
                    'Understand unfamiliar concepts',
                    'Generate prototypes',
                    'Review ideas',
                    'Analyze code',
                    'Improve productivity',
                  ].map((use, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:border-[#3B5973]/40 ${dk ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white/40 border-[#E5E7EB]'}`}>
                      <span className={`w-2 h-2 rounded-full bg-[#3B5973]`} />
                      <span className={`font-['Inter'] text-base ${dk ? 'text-white/60' : 'text-[#333]'}`}>I regularly use AI to {use}</span>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section id="philosophy" data-section="philosophy" className={`relative py-24 overflow-hidden bg-[#333]`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative">
          <RevealSection>
            <p className="font-['JetBrains_Mono'] text-xs tracking-[0.28em] uppercase text-[#BFC5CA]/60 mb-10">Philosophy</p>
          </RevealSection>
          <RevealSection delay={100}>
            <h2 className="font-['Space_Grotesk'] text-[clamp(42px,5.5vw,78px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#EAEAEA] max-w-[900px] mb-10">
              AI is my <em className="text-[#3B5973]/90 not-italic">co-pilot</em> —<br />I move from idea<br />to execution, fast.
            </h2>
          </RevealSection>
          <RevealSection delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                'Strong fundamentals matter.',
                'Curiosity drives growth.',
                'Building teaches more than consuming.',
                'Consistency beats intensity.',
                'AI is most powerful when paired with human understanding.',
              ].map((principle, i) => (
                <div key={i} className="p-5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                  <p className="font-['Inter'] text-base text-[#BFC5CA]">{principle}</p>
                </div>
              ))}
            </div>
          </RevealSection>
          <RevealSection delay={300}>
            <p className="font-['Inter'] text-lg text-[#BFC5CA] max-w-[700px] leading-[1.7] mb-6">
              Every project I build is another step toward becoming a better developer and future Machine Learning engineer.
            </p>
            <p className="font-['JetBrains_Mono'] text-xs tracking-[0.2em] uppercase text-[#BFC5CA]/40">— Muzafer Shaikh</p>
          </RevealSection>
          <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 font-['Space_Grotesk'] text-[clamp(80px,14vw,200px)] font-bold tracking-[-0.04em] leading-[0.85] text-white/[0.04] pointer-events-none select-none whitespace-nowrap">SHIP</div>
        </div>
      </section>

      {/* ── LOOKING AHEAD ── */}
      <section className={`relative py-24 ${dk ? 'bg-[#111118]' : 'bg-[#F5F5F5]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <RevealSection><SectionLabel>Looking Ahead</SectionLabel></RevealSection>
              <RevealSection delay={100}>
                <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 ${dk ? 'text-white' : 'text-[#333]'}`}>
                  What's <em className="text-[#3B5973] not-italic">next.</em>
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <p className={`font-['Inter'] text-lg leading-[1.7] mb-10 ${dk ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                  Over the next few years, I aim to deepen my expertise and make a meaningful impact in AI and software development.
                </p>
              </RevealSection>
            </div>
            <RevealSection delay={200}>
              <div className="space-y-4">
                {[
                  { icon: <Cpu className="w-5 h-5" />, text: 'Deepen my understanding of Machine Learning and NLP' },
                  { icon: <Rocket className="w-5 h-5" />, text: 'Build larger and more impactful software projects' },
                  { icon: <Code2 className="w-5 h-5" />, text: 'Contribute to open-source communities' },
                  { icon: <Target className="w-5 h-5" />, text: 'Participate in hackathons and technical competitions' },
                  { icon: <BookOpen className="w-5 h-5" />, text: 'Gain industry experience through internships' },
                  { icon: <Lightbulb className="w-5 h-5" />, text: 'Continue exploring how AI can improve software development' },
                ].map((goal, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:border-[#3B5973]/40 hover:-translate-y-0.5 ${dk ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white/40 border-[#E5E7EB]'}`}>
                    <span className="text-[#3B5973]">{goal.icon}</span>
                    <span className={`font-['Inter'] text-base ${dk ? 'text-white/70' : 'text-[#333]'}`}>{goal.text}</span>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" data-section="contact" className={`relative py-24 ${dk ? 'bg-[#0a0a0f]' : 'bg-[#EAEAEA]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <RevealSection><SectionLabel>Contact</SectionLabel></RevealSection>
              <RevealSection delay={100}>
                <h2 className={`font-['Space_Grotesk'] text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 ${dk ? 'text-white' : 'text-[#333]'}`}>
                  Let's build<br /><em className="text-[#3B5973] not-italic">something.</em>
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <p className={`font-['Inter'] text-lg leading-[1.7] mb-8 ${dk ? 'text-white/50' : 'text-[#9CA3AF]'}`}>
                  I'm always open to opportunities involving internships, collaborations, hackathons, open source, software development, AI, and machine learning.
                </p>
                <p className={`font-['Inter'] text-lg font-semibold ${dk ? 'text-white/70' : 'text-[#333]'}`}>
                  Let's learn, build, and grow together.
                </p>
              </RevealSection>
              <RevealSection delay={300}>
                <div className="space-y-0 mt-12">
                {[
  { meta: 'Email', label: 'shaikhmuzafer10@gmail.com', href: 'mailto:shaikhmuzafer10@gmail.com', Icon: Mail },
                    { meta: 'GitHub', label: 'github.com/muzafer26', href: 'https://github.com/muzafer26', Icon: Github },
                    { meta: 'LinkedIn', label: 'linkedin.com/in/muzafer-shaikh', href: 'https://www.linkedin.com/in/muzafer-shaikh-726a40338/', Icon: Linkedin },
                  ].map(link => (
                    <a key={link.meta} href={link.href} target={link.meta !== 'Email' ? '_blank' : undefined} rel={link.meta !== 'Email' ? 'noopener noreferrer' : undefined}
                      className={`group flex items-center justify-between py-5 border-b transition-colors ${dk ? 'border-white/[0.06] hover:border-white/20' : 'border-[#E5E7EB] hover:border-[#333]'}`}>
                      <div className="flex items-center gap-4">
                        <link.Icon className={`w-5 h-5 ${dk ? 'text-white/25' : 'text-[#BFC5CA]'} group-hover:text-[#3B5973] transition-colors`} />
                        <div>
                          <p className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.2em] uppercase mb-1 ${dk ? 'text-white/25' : 'text-[#BFC5CA]'}`}>{link.meta}</p>
                          <p className={`font-['Inter'] text-base font-medium group-hover:text-[#3B5973] transition-colors ${dk ? 'text-white' : 'text-[#333]'}`}>{link.label}</p>
                        </div>
                      </div>
                      <ArrowUpRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${dk ? 'text-white/20' : 'text-[#BFC5CA]'}`} />
                    </a>
                  ))}
                </div>
              </RevealSection>
            </div>
            <RevealSection delay={200}>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); const btn = e.currentTarget.querySelector('button[type=submit]') as HTMLButtonElement; if (btn) { btn.textContent = 'Sent ✓'; btn.style.background = '#3B5973'; btn.disabled = true; } }}>
                {[
                  { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                ].map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className={`block font-['Inter'] text-xs font-semibold tracking-[0.12em] uppercase mb-2 ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>{field.label}</label>
                    <input id={field.id} type={field.type} placeholder={field.placeholder} required className={`w-full font-['Inter'] text-base rounded-full px-6 py-3.5 border outline-none transition-colors ${dk ? 'bg-white/[0.04] text-white border-white/[0.08] placeholder:text-white/20 focus:border-[#3B5973]' : 'bg-[#F5F5F5] text-[#333] border-[#E5E7EB] placeholder:text-[#BFC5CA] focus:border-[#3B5973]'}`} />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className={`block font-['Inter'] text-xs font-semibold tracking-[0.12em] uppercase mb-2 ${dk ? 'text-white/40' : 'text-[#9CA3AF]'}`}>Message</label>
                  <textarea id="message" placeholder="What's on your mind?" required rows={5} className={`w-full font-['Inter'] text-base rounded-2xl px-6 py-3.5 border outline-none transition-colors resize-none ${dk ? 'bg-white/[0.04] text-white border-white/[0.08] placeholder:text-white/20 focus:border-[#3B5973]' : 'bg-[#F5F5F5] text-[#333] border-[#E5E7EB] placeholder:text-[#BFC5CA] focus:border-[#3B5973]'}`} />
                </div>
                <MagneticButton>
                  <button type="submit" className={`font-['Inter'] text-sm font-semibold uppercase tracking-[0.08em] rounded-full px-8 py-4 min-w-[178px] transition-all hover:opacity-85 hover:-translate-y-0.5 ${dk ? 'bg-white text-[#0a0a0f]' : 'bg-[#333] text-[#EAEAEA]'}`}>Send Message →</button>
                </MagneticButton>
              </form>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t py-8 ${dk ? 'bg-[#111118] border-white/[0.06]' : 'bg-[#F5F5F5] border-[#E5E7EB]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span className={`font-['Space_Grotesk'] text-lg font-bold tracking-[-0.02em] ${dk ? 'text-white' : 'text-[#333]'}`}>Muzafer Shaikh</span>
          <span className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.18em] uppercase ${dk ? 'text-white/25' : 'text-[#9CA3AF]'}`}>© 2026 · Built with intent.</span>
          <span className={`font-['JetBrains_Mono'] text-[11px] tracking-[0.18em] uppercase ${dk ? 'text-white/15' : 'text-[#BFC5CA]'}`}>Mumbai · India</span>
        </div>
      </footer>
    </div>
  );
}

/* ────────────────────────────────────────────
   UTILITY COMPONENTS
   ──────────────────────────────────────────── */

function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 200);
    };
    requestAnimationFrame(tick);
  }, []);
  if (done) return null;
  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#EAEAEA] dark:bg-[#0a0a0f] transition-opacity duration-500 ${progress >= 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="font-['Space_Grotesk'] text-[clamp(48px,8vw,80px)] font-bold tracking-[-0.04em] text-[#333] dark:text-white mb-8">
        MS<span className="text-[#3B5973]">.</span>
      </div>
      <div className="w-48 h-[2px] bg-[#E5E7EB] dark:bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-[#3B5973] rounded-full transition-all duration-100" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ('ontouchstart' in window) return;
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    const move = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`; };
    const animate = () => { cursorX += (mouseX - cursorX) * 0.15; cursorY += (mouseY - cursorY) * 0.15; cursor.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`; requestAnimationFrame(animate); };
    window.addEventListener('mousemove', move);
    const raf = requestAnimationFrame(animate);
    const handleOver = () => { cursor.style.opacity = '0.5'; };
    const handleOut = () => { cursor.style.opacity = '1'; };
    document.querySelectorAll('a, button').forEach(el => { el.addEventListener('mouseenter', handleOver); el.addEventListener('mouseleave', handleOut); });
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={cursorRef} className="hidden md:block fixed top-0 left-0 z-[999] w-8 h-8 rounded-full border border-[#3B5973]/40 pointer-events-none transition-opacity duration-150 mix-blend-difference" />
      <div ref={dotRef} className="hidden md:block fixed top-0 left-0 z-[999] w-1.5 h-1.5 rounded-full bg-[#3B5973] pointer-events-none" />
    </>
  );
}
