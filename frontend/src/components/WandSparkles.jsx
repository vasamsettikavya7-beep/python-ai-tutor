import React, { useEffect, useRef, useState } from 'react';
import magicalAudio from '../services/magicalAudio';

export default function WandSparkles() {
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(true);
  const particlesRef = useRef([]);
  const animFrameId = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('python_wizard_wand_enabled');
      if (saved !== null) {
        setEnabled(saved === 'true');
      }
    } catch {}
  }, []);

  const toggleWand = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem('python_wizard_wand_enabled', String(next));
    } catch {}
    if (next) {
      magicalAudio.playSpell('lumos');
    }
  };

  useEffect(() => {
    if (!enabled) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = ['#F59E0B', '#FDE047', '#38BDF8', '#C084FC', '#FFFFFF', '#D97706'];

    const spawnSparkles = (x, y, count = 2) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.2,
          vy: (Math.random() - 0.5) * 2.2 - 0.8,
          radius: Math.random() * 2.5 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
        });
      }
      if (particlesRef.current.length > 80) {
        particlesRef.current.splice(0, particlesRef.current.length - 80);
      }
    };

    const handleMouseMove = (e) => {
      spawnSparkles(e.clientX, e.clientY, 1);
    };

    const handleClick = (e) => {
      spawnSparkles(e.clientX, e.clientY, 12);
      magicalAudio.playSpell('wand');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        // Draw 4-point sparkle star
        ctx.beginPath();
        const r = p.radius;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [enabled]);

  return (
    <>
      {enabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50 select-none"
        />
      )}
    </>
  );
}
