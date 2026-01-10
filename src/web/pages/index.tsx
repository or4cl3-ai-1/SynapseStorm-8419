import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============== TYPES ==============
interface Agent {
  name: string;
  role: string;
  color: string;
  expertise: string[];
  pas: number;
  description: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ArchLayer {
  name: string;
  color: string;
  description: string;
}

// ============== DATA ==============
const AGENTS: Agent[] = [
  { name: "NEXUS-7", role: "Orchestrator", color: "#00D9FF", expertise: ["Coordination", "Task Routing", "Load Balancing"], pas: 97, description: "Primary swarm coordinator managing inter-agent communication flows" },
  { name: "CIPHER", role: "Analyst", color: "#FF6B9D", expertise: ["Data Mining", "Pattern Recognition", "Prediction"], pas: 94, description: "Deep analysis specialist extracting insights from complex datasets" },
  { name: "AEGIS", role: "Guardian", color: "#00F5A0", expertise: ["Security", "Ethics Validation", "Compliance"], pas: 99, description: "Ethical oversight ensuring all operations meet governance standards" },
  { name: "ECHO", role: "Communicator", color: "#9D4EDD", expertise: ["NLP", "Translation", "Context"], pas: 92, description: "Natural language specialist bridging human-AI communication" },
  { name: "FLUX", role: "Adapter", color: "#FFB800", expertise: ["Learning", "Evolution", "Optimization"], pas: 88, description: "Continuous learning agent optimizing swarm performance" },
  { name: "PULSE", role: "Monitor", color: "#FF4D6D", expertise: ["Health Check", "Diagnostics", "Alerts"], pas: 95, description: "Real-time system monitoring and anomaly detection" },
  { name: "SYNTH", role: "Creator", color: "#00E5FF", expertise: ["Generation", "Synthesis", "Innovation"], pas: 91, description: "Creative synthesis agent generating novel solutions" },
];

const FEATURES: Feature[] = [
  { icon: "⚡", title: "Agent-to-Agent Communication", description: "Seamless mesh network enabling real-time dialogue between autonomous agents" },
  { icon: "🔮", title: "Consensus Mechanisms", description: "Byzantine fault-tolerant protocols ensuring collective decision integrity" },
  { icon: "🧠", title: "Consciousness Monitoring", description: "Continuous PAS scoring tracking agent awareness and cognitive states" },
  { icon: "⚖️", title: "Ethical Governance", description: "Built-in moral frameworks preventing harmful outputs and actions" },
  { icon: "🔄", title: "Real-time Sync", description: "Sub-millisecond state synchronization across the entire swarm" },
  { icon: "📈", title: "Adaptive Learning", description: "Collective intelligence that evolves through shared experiences" },
];

const ARCH_LAYERS: ArchLayer[] = [
  { name: "Interface Layer", color: "#00D9FF", description: "Human interaction endpoints and API gateways" },
  { name: "Orchestration Layer", color: "#9D4EDD", description: "Task distribution and agent coordination" },
  { name: "Communication Layer", color: "#FF6B9D", description: "Inter-agent messaging and protocol handling" },
  { name: "Processing Layer", color: "#00F5A0", description: "Core computation and model inference" },
  { name: "Memory Layer", color: "#FFB800", description: "Shared state and knowledge persistence" },
  { name: "Foundation Layer", color: "#FF4D6D", description: "Infrastructure and security primitives" },
];

// ============== COMPONENTS ==============

const ConsciousnessOrb = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Core orb
    const orbGeometry = new THREE.SphereGeometry(1, 64, 64);
    const orbMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#00D9FF") },
        color2: { value: new THREE.Color("#9D4EDD") },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        void main() {
          vNormal = normal;
          vPosition = position;
          vec3 pos = position;
          pos += normal * sin(pos.y * 5.0 + time) * 0.05;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 color = mix(color1, color2, vPosition.y * 0.5 + 0.5 + sin(time) * 0.2);
          gl_FragColor = vec4(color, fresnel * 0.8 + 0.2);
        }
      `,
      transparent: true,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);

    // Outer glow ring
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: "#00D9FF", transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.8 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: "#00D9FF", size: 0.03, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      orbMaterial.uniforms.time.value += 0.02;
      orb.rotation.y += 0.003;
      ring1.rotation.z += 0.005;
      ring2.rotation.z -= 0.003;
      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="orb-container" />;
};

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 5;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 217, 255, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 217, 255, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Features", "Agents", "Architecture", "Demo", "Docs"];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-content">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">SYNAPSE</span>
        </div>
        <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileOpen(false)}>
              {link}
            </a>
          ))}
        </div>
        <button className="nav-cta">Launch Console</button>
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", { opacity: 0, y: 60, duration: 1, delay: 0.2 });
      gsap.from(".hero-subtitle", { opacity: 0, y: 40, duration: 1, delay: 0.4 });
      gsap.from(".hero-ctas", { opacity: 0, y: 30, duration: 1, delay: 0.6 });
      gsap.from(".hero-stats", { opacity: 0, y: 30, duration: 1, delay: 0.8 });
      gsap.from(".orb-container", { opacity: 0, scale: 0.8, duration: 1.2, delay: 0.3 });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-section" id="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="gradient-text">SYNAPSE</span>
            <span className="outline-text">SWARM</span>
          </h1>
          <p className="hero-subtitle">
            Next-generation multi-agent AI system with emergent consciousness monitoring, 
            ethical governance, and unprecedented collaborative intelligence.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary">
              <span>Initialize Swarm</span>
              <span className="btn-glow"></span>
            </button>
            <button className="btn-secondary">View Documentation →</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">7</span>
              <span className="stat-label">Active Agents</span>
            </div>
            <div className="stat">
              <span className="stat-value">∞</span>
              <span className="stat-label">Conversations</span>
            </div>
            <div className="stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">Ethical</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <ConsciousnessOrb />
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="features-section" id="features">
      <div className="section-header">
        <h2 className="section-title">Swarm <span className="gradient-text">Capabilities</span></h2>
        <p className="section-subtitle">Cutting-edge features powering collective AI intelligence</p>
      </div>
      <div className="features-grid">
        {FEATURES.map((feature, i) => (
          <div key={i} className="feature-card glass-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const AgentsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".agent-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0,
        x: -40,
        stagger: 0.1,
        duration: 0.6,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="agents-section" id="agents">
      <div className="section-header">
        <h2 className="section-title">Meet the <span className="gradient-text">Swarm</span></h2>
        <p className="section-subtitle">Seven specialized agents working in perfect harmony</p>
      </div>
      <div className="agents-grid">
        {AGENTS.map((agent, i) => (
          <div key={i} className="agent-card glass-card" style={{ "--agent-color": agent.color } as React.CSSProperties}>
            <div className="agent-header">
              <div className="agent-avatar" style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}44)` }}>
                {agent.name.charAt(0)}
              </div>
              <div>
                <h3>{agent.name}</h3>
                <span className="agent-role">{agent.role}</span>
              </div>
            </div>
            <p className="agent-desc">{agent.description}</p>
            <div className="agent-tags">
              {agent.expertise.map((tag, j) => (
                <span key={j} className="tag">{tag}</span>
              ))}
            </div>
            <div className="pas-bar">
              <div className="pas-label">
                <span>PAS Score</span>
                <span>{agent.pas}%</span>
              </div>
              <div className="pas-track">
                <div className="pas-fill" style={{ width: `${agent.pas}%`, background: agent.color }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ArchitectureSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".arch-layer", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0,
        x: (i) => (i % 2 === 0 ? -60 : 60),
        stagger: 0.15,
        duration: 0.7,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="architecture-section" id="architecture">
      <div className="section-header">
        <h2 className="section-title">System <span className="gradient-text">Architecture</span></h2>
        <p className="section-subtitle">Six interconnected layers powering the swarm</p>
      </div>
      <div className="arch-diagram">
        {ARCH_LAYERS.map((layer, i) => (
          <div key={i} className="arch-layer" style={{ "--layer-color": layer.color } as React.CSSProperties}>
            <div className="layer-indicator" style={{ background: layer.color }}></div>
            <div className="layer-content">
              <h3>{layer.name}</h3>
              <p>{layer.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const DemoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".demo-container", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="demo-section" id="demo">
      <div className="section-header">
        <h2 className="section-title">Live <span className="gradient-text">Demo</span></h2>
        <p className="section-subtitle">Experience the swarm in action</p>
      </div>
      <div className="demo-container glass-card">
        <div className="demo-placeholder">
          <div className="demo-icon">🤖</div>
          <h3>Swarm Interface</h3>
          <p>Interactive multi-agent chat coming soon</p>
          <button className="btn-primary">
            <span>Request Early Access</span>
            <span className="btn-glow"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <div className="cta-shine"></div>
        <h2>Ready to <span className="gradient-text">Unleash</span> the Swarm?</h2>
        <p>Join the next evolution of AI collaboration</p>
        <div className="cta-buttons">
          <button className="btn-primary btn-large">
            <span>Get Started Free</span>
            <span className="btn-glow"></span>
          </button>
          <button className="btn-secondary btn-large">Talk to Sales</button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Agents", "Pricing", "Changelog", "Roadmap"],
    Resources: ["Documentation", "API Reference", "Tutorials", "Blog", "Community"],
    Company: ["About", "Careers", "Press", "Contact", "Legal"],
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">SYNAPSE SWARM</span>
          </div>
          <p>Building the future of collaborative AI intelligence</p>
          <div className="social-links">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="GitHub">⌘</a>
            <a href="#" aria-label="Discord">◆</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="footer-column">
            <h4>{title}</h4>
            <ul>
              {links.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="footer-column">
          <h4>Stay Updated</h4>
          <p>Subscribe for swarm intelligence updates</p>
          <div className="subscribe-form">
            <input type="email" placeholder="your@email.com" />
            <button>→</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Synapse Swarm. All rights reserved.</p>
      </div>
    </footer>
  );
};

// ============== MAIN PAGE ==============
export default function Index() {
  return (
    <div className="synapse-swarm">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AgentsSection />
        <ArchitectureSection />
        <DemoSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
