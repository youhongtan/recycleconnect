import React from "react";
import Hero from "@/components/home/Hero";
import StatsBand from "@/components/home/StatsBand";
import FeatureCards from "@/components/home/FeatureCards";
import GamificationTeaser from "@/components/home/GamificationTeaser";
import Reveal from "@/components/common/Reveal";
import { Image } from "@/components/ui/image";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsBand />
      <FeatureCards />

      <section className="max-w-6xl mx-auto px-6 py-8">
        <Reveal>
          <div className="glass orbital soft-shadow overflow-hidden grid lg:grid-cols-2">
            <Image
              src="https://media.base44.com/images/public/6a67017a886f99eed0748a3d/6db2338b5_generated_7fa5e08a.png"
              alt="Isometric illustration of a modern Malaysian city with glass recycling hubs"
              className="w-full h-72 lg:h-full"
            />
            <div className="p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Built for Malaysia</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                From mall drop-offs to kampung collection points
              </h2>
              <p className="mt-4 text-muted-foreground">
                RecycleConnect maps real Malaysian recycling infrastructure — shopping-centre bins at IPC and 1 Utama,
                council centres, scrap dealers and cooking-oil collectors — so the right bin is always minutes away.
              </p>
              <Link to="/finder" className="mt-8 inline-flex h-14 px-8 rounded-full glass font-semibold items-center hover:bg-primary/10 transition">
                Explore the map
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <GamificationTeaser />
    </div>
  );
}