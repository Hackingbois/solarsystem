import { useState, useEffect, useRef, useCallback } from 'react';
import { planets, PlanetData } from './data/planets';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawSolarSystem = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw starfield background
    drawStars(ctx, width, height);

    // Draw orbit paths
    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.displayOrbit, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    sunGradient.addColorStop(0, '#fff7e6');
    sunGradient.addColorStop(0.3, '#ffcc00');
    sunGradient.addColorStop(0.7, '#ff8c00');
    sunGradient.addColorStop(1, '#ff4500');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const sunGlow = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 55);
    sunGlow.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    sunGlow.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fillStyle = sunGlow;
    ctx.fill();

    // Draw planets
    planets.forEach((planet) => {
      // Calculate position based on orbital period
      // Base speed: Earth completes one orbit in ~30 seconds at 1x speed
      const earthOrbitSeconds = 30;
      const earthOrbitalPeriod = 365;
      const angularSpeed = (2 * Math.PI * earthOrbitalPeriod) / (planet.orbitalPeriod * earthOrbitSeconds);
      const angle = time * angularSpeed;
      const x = centerX + planet.displayOrbit * Math.cos(angle);
      const y = centerY + planet.displayOrbit * Math.sin(angle);

      // Planet glow
      const glowGradient = ctx.createRadialGradient(x, y, planet.displaySize * 0.5, x, y, planet.displaySize * 2.5);
      glowGradient.addColorStop(0, planet.glowColor + '60');
      glowGradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, planet.displaySize * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Planet body
      const planetGradient = ctx.createRadialGradient(
        x - planet.displaySize * 0.3,
        y - planet.displaySize * 0.3,
        0,
        x,
        y,
        planet.displaySize
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(0.7, planet.color);
      planetGradient.addColorStop(1, darkenColor(planet.color, 30));

      ctx.beginPath();
      ctx.arc(x, y, planet.displaySize, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn rings
      if (planet.id === 'saturn') {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.displaySize * 2.2, planet.displaySize * 0.6, -0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210, 180, 120, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Planet label (if hovered or selected)
      if (hoveredPlanet === planet.id || selectedPlanet?.id === planet.id) {
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y - planet.displaySize - 8);
      }
    });
  }, [hoveredPlanet, selectedPlanet]);

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Use seeded random for consistent stars
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const seed = i * 9301 + 49297;
      const x = (seed % 233280) / 233280 * width;
      const y = ((seed * 7) % 233280) / 233280 * height;
      const size = ((seed * 13) % 233280) / 233280 * 1.5 + 0.5;
      const opacity = ((seed * 17) % 233280) / 233280 * 0.5 + 0.3;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }
  };

  const animate = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (lastTimestampRef.current === 0) {
      lastTimestampRef.current = timestamp;
    }

    const delta = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;

    if (isPlaying) {
      timeRef.current += delta * speed;
    }

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    drawSolarSystem(ctx, width, height, timeRef.current * 0.001);
    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed, drawSolarSystem]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Check if clicked on a planet
    for (const planet of planets) {
      const earthOrbitSeconds = 30;
      const earthOrbitalPeriod = 365;
      const angularSpeed = (2 * Math.PI * earthOrbitalPeriod) / (planet.orbitalPeriod * earthOrbitSeconds);
      const angle = timeRef.current * 0.001 * angularSpeed;
      const px = centerX + planet.displayOrbit * Math.cos(angle);
      const py = centerY + planet.displayOrbit * Math.sin(angle);

      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.displaySize + 5) {
        setSelectedPlanet(planet);
        return;
      }
    }

    // Check if clicked on Sun
    const sunDist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (sunDist <= 35) {
      setSelectedPlanet(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let found = false;
    for (const planet of planets) {
      const earthOrbitSeconds = 30;
      const earthOrbitalPeriod = 365;
      const angularSpeed = (2 * Math.PI * earthOrbitalPeriod) / (planet.orbitalPeriod * earthOrbitSeconds);
      const angle = timeRef.current * 0.001 * angularSpeed;
      const px = centerX + planet.displayOrbit * Math.cos(angle);
      const py = centerY + planet.displayOrbit * Math.sin(angle);

      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.displaySize + 5) {
        setHoveredPlanet(planet.id);
        canvas.style.cursor = 'pointer';
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <div className="w-full h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-lg shadow-orange-500/30"></div>
          <h1 className="text-xl font-bold text-white">Solar System Explorer</h1>
        </div>
        <p className="text-sm text-gray-400 hidden sm:block">Click on any planet to learn more</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full"
          />
          
          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 backdrop-blur-md rounded-full px-6 py-3 border border-gray-700 shadow-xl">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 text-white"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="2" width="4" height="12" rx="1" />
                  <rect x="9" y="2" width="4" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2l10 6-10 6V2z" />
                </svg>
              )}
            </button>

            {/* Speed Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Speed:</span>
              {[0.5, 1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                    speed === s
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Planet Info Panel */}
        {selectedPlanet && (
          <div className="w-80 bg-gray-900/95 backdrop-blur-md border-l border-gray-800 p-6 overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedPlanet.name}</h2>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Planet Visual */}
            <div className="flex justify-center mb-6">
              <div
                className="rounded-full shadow-lg"
                style={{
                  width: `${Math.max(selectedPlanet.displaySize * 4, 40)}px`,
                  height: `${Math.max(selectedPlanet.displaySize * 4, 40)}px`,
                  background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color}, ${darkenColor(selectedPlanet.color, 30)})`,
                  boxShadow: `0 0 30px ${selectedPlanet.glowColor}40, 0 0 60px ${selectedPlanet.glowColor}20`,
                }}
              />
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {selectedPlanet.description}
            </p>

            {/* Stats */}
            <div className="space-y-4">
              <StatItem
                label="Type"
                value={selectedPlanet.type}
                icon="🪐"
              />
              <StatItem
                label="Diameter"
                value={`${selectedPlanet.diameter.toLocaleString()} km`}
                icon="📏"
              />
              <StatItem
                label="Distance from Sun"
                value={`${selectedPlanet.distanceFromSun.toLocaleString()} million km`}
                icon="☀️"
              />
              <StatItem
                label="Orbital Period"
                value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                icon="🔄"
              />
              <StatItem
                label="Known Moons"
                value={selectedPlanet.moons.toString()}
                icon="🌙"
              />
            </div>

            {/* Fun Fact */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-xs text-blue-300 font-medium mb-1">💡 Fun Fact</p>
              <p className="text-sm text-blue-200">
                {getFunFact(selectedPlanet.id)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Planet Quick Select */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {planets.map((planet) => (
          <button
            key={planet.id}
            onClick={() => setSelectedPlanet(planet)}
            onMouseEnter={() => setHoveredPlanet(planet.id)}
            onMouseLeave={() => setHoveredPlanet(null)}
            className={`group relative flex flex-col items-center transition-transform duration-200 hover:scale-125 ${
              selectedPlanet?.id === planet.id ? 'scale-125' : ''
            }`}
            title={planet.name}
          >
            <div
              className="rounded-full transition-shadow duration-200"
              style={{
                width: `${Math.max(planet.displaySize * 1.5, 12)}px`,
                height: `${Math.max(planet.displaySize * 1.5, 12)}px`,
                background: `radial-gradient(circle at 35% 35%, ${lightenColor(planet.color, 30)}, ${planet.color})`,
                boxShadow: selectedPlanet?.id === planet.id
                  ? `0 0 12px ${planet.glowColor}`
                  : `0 0 4px ${planet.glowColor}60`,
              }}
            />
            <span className="text-[10px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {planet.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} Earth days`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} Earth years (${days.toLocaleString()} days)`;
}

function getFunFact(planetId: string): string {
  const facts: Record<string, string> = {
    mercury: 'A year on Mercury is just 88 Earth days, but a single day lasts 59 Earth days!',
    venus: 'Venus spins backwards — the Sun rises in the west and sets in the east.',
    earth: 'Earth is the only planet not named after a Greek or Roman god.',
    mars: 'Olympus Mons on Mars is nearly 3 times the height of Mount Everest!',
    jupiter: 'Jupiter\'s Great Red Spot is a storm larger than Earth that has raged for over 350 years.',
    saturn: 'Saturn\'s density is so low it would float in water (if you had a big enough bathtub).',
    uranus: 'Uranus rotates on its side, likely due to a collision with an Earth-sized object long ago.',
    neptune: 'Neptune has the strongest winds in the solar system, reaching 2,100 km/h!',
  };
  return facts[planetId] || '';
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

export default App;
