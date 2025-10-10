import React from 'react'

const Scene: React.FC = () => {
  // Decorative blue sphere that grows large on mount.
  // Implemented with simple CSS so we don't need three.js.
  return (
    <div className="relative w-full h-full overflow-hidden">
      <style>{`
        @keyframes growSphere {
          0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0.45; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(8); opacity: 0.3; }
        }

        /* Reduced motion: stop the large animation but keep a readable static sphere */
        @media (prefers-reduced-motion: reduce) {
          .indr-sphere { animation: none !important; transform: translate(-50%, -50%) scale(1.8) !important; opacity: 1 !important; }
          .indr-halo { animation: none !important; opacity: 0.28 !important; }
        }
      `}</style>

      {/* Stronger core sphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 indr-sphere"
        style={{
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 25%, #2b6cb0 0%, #1e7ed6 45%, #176aa8 100%)',
          boxShadow: '0 30px 90px rgba(30,126,214,0.65), inset -10px -10px 40px rgba(255,255,255,0.08)',
          transform: 'translate(-50%, -50%)',
          animation: 'growSphere 3.2s cubic-bezier(.2,.9,.2,1) forwards',
          willChange: 'transform, opacity',
          filter: 'blur(0.4px)'
        }}
      />

      {/* Large blurred halo to amplify presence */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 indr-halo"
        style={{
          width: 840,
          height: 840,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,126,214,0.9) 0%, rgba(23,106,168,0.6) 35%, rgba(23,106,168,0.0) 70%)',
          transform: 'translate(-50%, -50%)',
          opacity: 0.36,
          filter: 'blur(48px)',
          animation: 'growSphere 3.6s ease-out forwards',
          willChange: 'transform, opacity'
        }}
      />

      {/* Backdrop gradient using medium blues */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(43,108,176,0.70) 0%, rgba(30,126,214,0.54) 50%, rgba(23,106,168,0.46) 100%)' }} />
    </div>
  )
}

export default Scene
