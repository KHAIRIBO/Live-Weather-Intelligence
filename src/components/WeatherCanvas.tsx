'use client';

import React, { useEffect, useRef } from 'react';
import { WeatherTheme } from '@/types/weather';

interface WeatherCanvasProps {
  theme: WeatherTheme;
}

export const WeatherCanvas: React.FC<WeatherCanvasProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle definitions based on theme
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed?: number;
    }

    const particles: Particle[] = [];
    const count = theme === 'rainy' || theme === 'thunderstorm' ? 120 : theme === 'snowy' ? 80 : 50;

    for (let i = 0; i < count; i++) {
      if (theme === 'rainy' || theme === 'thunderstorm') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedY: Math.random() * 10 + 12,
          speedX: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      } else if (theme === 'snowy') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 1.5 + 0.5,
          speedX: Math.sin(Math.random() * Math.PI) * 0.8,
          opacity: Math.random() * 0.7 + 0.3,
        });
      } else if (theme === 'clear-night') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.7,
          size: Math.random() * 1.8 + 0.5,
          speedY: 0,
          speedX: 0,
          opacity: Math.random(),
          fadeSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        });
      } else if (theme === 'clear-day') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          size: Math.random() * 80 + 40,
          speedY: -Math.random() * 0.2 - 0.1,
          speedX: Math.random() * 0.2 - 0.1,
          opacity: Math.random() * 0.05 + 0.02,
        });
      } else {
        // cloudy / fog
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 120 + 60,
          speedY: 0,
          speedX: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.04 + 0.01,
        });
      }
    }

    let flashCounter = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Flash background for thunderstorm
      if (theme === 'thunderstorm') {
        flashCounter++;
        if (flashCounter % 280 === 0 || Math.random() < 0.003) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(0, 0, width, height);
        }
      }

      particles.forEach((p) => {
        if (theme === 'rainy' || theme === 'thunderstorm') {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 220, 255, ${p.opacity})`;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.speedY);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (theme === 'snowy') {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.02) * 0.5;

          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        } else if (theme === 'clear-night') {
          if (p.fadeSpeed) {
            p.opacity += p.fadeSpeed;
            if (p.opacity >= 0.95 || p.opacity <= 0.15) {
              p.fadeSpeed = -p.fadeSpeed;
            }
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.opacity)})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme === 'clear-day') {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `rgba(255, 230, 160, ${p.opacity})`);
          gradient.addColorStop(1, 'rgba(255, 230, 160, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < -p.size) p.x = width + p.size;
          if (p.x > width + p.size) p.x = -p.size;
          if (p.y < -p.size) p.y = height + p.size;
        } else {
          // fog / cloudy
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `rgba(220, 230, 240, ${p.opacity})`);
          gradient.addColorStop(1, 'rgba(220, 230, 240, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          if (p.x > width + p.size) p.x = -p.size;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
