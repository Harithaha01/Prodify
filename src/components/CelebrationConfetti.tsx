import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  startX: number;
  startY: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rotation: number;
  shape: 'circle' | 'square' | 'triangle';
}

const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#3b82f6', // Blue
];

export function CelebrationConfetti({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const newParticles: Particle[] = [];
    const particleCount = 40; // Total particles per trigger (20 per cannon)

    // Left cannon (firing up and right)
    for (let i = 0; i < particleCount / 2; i++) {
      const angle = (Math.random() * 45 + 15) * (Math.PI / 180); // 15 to 60 degrees
      const speed = Math.random() * 22 + 15;
      newParticles.push({
        id: Date.now() + i * 2,
        startX: 40,
        startY: window.innerHeight - 80,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 12 + 6,
        angle,
        speed,
        rotation: Math.random() * 360,
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as any,
      });
    }

    // Right cannon (firing up and left)
    for (let i = 0; i < particleCount / 2; i++) {
      const angle = (Math.random() * 45 + 105) * (Math.PI / 180); // 105 to 150 degrees
      const speed = Math.random() * 22 + 15;
      newParticles.push({
        id: Date.now() + i * 2 + 1,
        startX: window.innerWidth - 40,
        startY: window.innerHeight - 80,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 12 + 6,
        angle,
        speed,
        rotation: Math.random() * 360,
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as any,
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Cleanup stale particles after animation completes to free memory
    const timer = setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id > Date.now() - 2500));
    }, 2500);

    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => {
          // Physics simulation over time via keyframes:
          // Left-side or right-side trajectory depending on launch angle
          const travelX = Math.cos(p.angle) * p.speed * 20;
          const travelY = -Math.sin(p.angle) * p.speed * 20 + 350; // gravity pushes it down at the end

          return (
            <motion.div
              key={p.id}
              className="absolute"
              style={{
                left: p.startX,
                top: p.startY,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '0px',
                clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
              }}
              initial={{ 
                opacity: 1, 
                scale: 0.2, 
                x: 0, 
                y: 0, 
                rotate: 0 
              }}
              animate={{ 
                opacity: [1, 1, 0.9, 0.6, 0],
                scale: [0.2, 1.2, 1, 0.8, 0.2],
                x: travelX,
                y: travelY,
                rotate: p.rotation + 900
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2.2, 
                ease: "easeOut" 
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
