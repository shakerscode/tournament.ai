'use client';

import { Player } from '@/lib/localDb';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

export interface PlayerSliderProps {
  players: Player[];
}

export default function PlayerSlider({ players }: PlayerSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

  // Filter approved players only
  const approvedPlayers = players.filter((p) => p.status === 'approved').slice(0, 8);

  useEffect(() => {
    if (approvedPlayers.length === 0) return;

    // Auto-advance every 1 second
    const interval = setInterval(() => {
      if (!isPaused) {
        setActiveIndex((prev) => (prev + 1) % approvedPlayers.length);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [approvedPlayers.length, isPaused]);

  // GSAP animation for slider items
  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('[data-player-item]');
    if (items.length === 0) return;

    // Kill previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    const tl = gsap.timeline();
    timelineRef.current = tl;

    items.forEach((item, idx) => {
      const isActive = idx === activeIndex;
      const offset = idx - activeIndex;

      if (isActive) {
        // Animate active item: scale up and show full card
        tl.to(
          item,
          {
            scale: 1.3,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out',
          },
          0
        );

        tl.to(
          item.querySelector('[data-player-content]'),
          {
            opacity: 1,
            duration: 0.3,
          },
          0.2
        );
      } else {
        // Animate inactive items: scale down
        const translateX = offset > 0 ? 120 : -120;
        tl.to(
          item,
          {
            scale: 0.7,
            opacity: 0.6,
            x: translateX,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0
        );

        tl.to(
          item.querySelector('[data-player-content]'),
          {
            opacity: 0,
            duration: 0.2,
          },
          0
        );
      }
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [activeIndex]);

  if (approvedPlayers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-accent-gray-medium">No approved players yet</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container-tight">
        <h2 className="text-3xl font-bold text-primary-red mb-2">Featured Players</h2>
        <p className="text-accent-gray-medium mb-8">Hover to pause the carousel</p>

        <div
          ref={containerRef}
          className="flex items-center justify-center gap-4 overflow-hidden py-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {approvedPlayers.map((player, idx) => (
            <div
              key={player.id}
              data-player-item
              className="flex-shrink-0 w-32 h-40 rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Small box */}
              <div className="relative w-full h-full bg-gradient-to-br from-primary-red/20 to-secondary-black-lighter rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
                {/* Background image or placeholder */}
                <div className="w-full h-full bg-secondary-black-lighter flex items-center justify-center text-4xl">
                  🏸
                </div>

                {/* Full card content (hidden initially) */}
                <div
                  data-player-content
                  className="absolute inset-0 bg-gradient-to-b from-secondary-black-light/90 to-secondary-black/95 p-3 flex flex-col justify-between opacity-0"
                >
                  <div>
                    <h3 className="font-bold text-primary-red text-sm line-clamp-2">
                      {player.name}
                    </h3>
                    <p className="text-accent-gray-medium text-xs mt-1">{player.category}</p>
                  </div>

                  {/* Social links placeholder */}
                  <div className="flex gap-2 justify-center">
                    <a href="#" className="text-accent-gray-medium hover:text-primary-red text-xs">
                      📱
                    </a>
                    <a href="#" className="text-accent-gray-medium hover:text-primary-red text-xs">
                      💬
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {approvedPlayers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'bg-primary-red w-8' : 'bg-secondary-black-lighter'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === activeIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
