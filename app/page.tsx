"use client";

import { getPlayers, initializeDb } from "@/lib/localDb"; 
import PlayerSlider from "@/components/PlayerSlider";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(()=>{
    router.push("/instant-tournament")
  },[])

  // Initialize DB and load players
  useEffect(() => {
    const init = async () => {
      await initializeDb();
      const playersData = await getPlayers();
      setPlayers(playersData);
    };
    init();
  }, []);

  // GSAP hero animations
  useEffect(() => {
    if (!heroRef.current) return;

    const timeline = gsap.timeline({ delay: 0.3 });

    // Animate headline
    timeline.from(
      heroRef.current.querySelector("[data-hero-headline]"),
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      },
      0
    );

    // Animate subheadline
    timeline.from(
      heroRef.current.querySelector("[data-hero-subheadline]"),
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      0.2
    );

    // Animate CTA buttons
    timeline.from(
      heroRef.current.querySelectorAll("[data-hero-cta]"),
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out",
        stagger: 0.1,
      },
      0.4
    );

    // Button hover animation
    const buttons = heroRef.current.querySelectorAll("[data-hero-cta]");
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    return () => {
      buttons.forEach((btn) => {
        btn.removeEventListener("mouseenter", () => {});
        btn.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-red/20 to-secondary-black"
      >
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          {/* Video background placeholder - using gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-black via-primary-red/30 to-secondary-black opacity-80" />

          {/* Animated SVG badminton shuttlecock */}
          <svg
            className="absolute top-10 right-10 w-32 h-32 text-primary-red/20 animate-bounce"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="4" r="2" />
            <path
              d="M12 6v12M6 12h12M8 10l8-8M8 14l8 8M16 10l-8-8M16 14l-8 8"
              strokeWidth="1.5"
            />
          </svg>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-red/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-tight text-center px-4">
          <h1
            data-hero-headline
            className="text-5xl md:text-6xl lg:text-7xl font-black text-accent-white mb-6 leading-tight"
          >
            Play Fast.
            <br />
            <span className="text-primary-red">Win Faster.</span>
          </h1>

          <p
            data-hero-subheadline
            className="text-lg md:text-2xl text-accent-gray-medium mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Join local tournaments, track player payments, and manage fixtures —
            all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/instant-tournament"
              data-hero-cta
              className="btn btn-primary text-lg px-8 py-4 inline-block"
            >
              🚀 Instant Tournament
            </Link>
            <Link
              href="/register"
              data-hero-cta
              className="btn btn-outline text-lg px-8 py-4 inline-block"
            >
              📝 Register Now
            </Link>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div className="absolute bottom-0 right-0 w-1/3 h-2/3 pointer-events-none hidden lg:block">
          <div className="text-9xl opacity-20">🏸</div>
        </div>
      </section>

      {/* Player Slider */}
      <PlayerSlider players={players} />

      {/* Upcoming Tournament Section */}
      <section className="py-16 bg-secondary-black-light">
        <div className="container-tight text-center">
          <h2 className="text-4xl font-bold text-primary-red mb-4">
            Tournament 2025 is Coming Soon
          </h2>
          <p className="text-accent-gray-medium text-lg mb-8">
            Get ready for the biggest badminton event of the year
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="card text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-primary-red font-bold text-xl mb-2">
                Schedule
              </h3>
              <p className="text-accent-gray-medium">
                Multiple tournament formats to choose from
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-primary-red font-bold text-xl mb-2">
                Players
              </h3>
              <p className="text-accent-gray-medium">
                Join with friends and compete together
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-primary-red font-bold text-xl mb-2">
                Prizes
              </h3>
              <p className="text-accent-gray-medium">
                Win exciting awards and recognition
              </p>
            </div>
          </div>

          <button className="btn btn-primary text-lg mt-12 px-8 py-4">
            Register Interest
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-tight text-center">
          <h2 className="text-4xl font-bold text-accent-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-accent-gray-medium text-lg mb-8 max-w-2xl mx-auto">
            Create your first tournament instantly and start managing your
            badminton events like a pro.
          </p>

          <Link
            href="/instant-tournament"
            className="btn btn-primary text-lg px-12 py-4"
          >
            Create Tournament Now
          </Link>
        </div>
      </section>
    </>
  );
}
