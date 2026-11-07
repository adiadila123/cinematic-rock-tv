import React from "react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Navbar } from "@/components/Navbar";
import { MobileTabBar } from "@/components/MobileTabBar";
import { HeroIntro } from "@/components/HeroIntro";
import { LiveTelevisionDeck } from "@/components/LiveTelevisionDeck";
import { RockExperienceSection } from "@/components/RockExperienceSection";
import { MusicDiscoverySection } from "@/components/MusicDiscoverySection";
import { RockLegendsSection } from "@/components/RockLegendsSection";
import { LegendVideoModal } from "@/components/LegendVideoModal";
import { FinalExperienceFooter } from "@/components/FinalExperienceFooter";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StructuredData } from "@/components/StructuredData";
import { MotionPrompt } from "@/components/MotionPrompt";

export default async function RockTvPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "ro";
  const dict = getDictionary(locale);
  const boundary = (title: string) => ({
    fallbackTitle: title,
    fallbackBody: dict.errors.body,
    resetLabel: dict.errors.reset,
  });

  return (
    <div className="relative min-h-screen text-chalk">
      <StructuredData locale={locale} />

      {/* Ambient stage light the glass surfaces refract */}
      <div aria-hidden="true" className="ambient-stage">
        <span className="ambient-orb ambient-orb--crimson" />
        <span className="ambient-orb ambient-orb--tungsten" />
        <span className="ambient-orb ambient-orb--deep" />
      </div>

      <a
        href="#live-tv"
        className="glass glass-tint-crimson sr-only rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:px-5 focus:py-3 focus:font-condensed focus:text-base focus:font-bold focus:uppercase focus:tracking-wider focus:text-chalk"
      >
        {dict.a11y.skipToLive}
      </a>

      <Navbar />

      <main id="main-content" className="relative">
        <ErrorBoundary {...boundary(dict.errors.hero)}>
          <HeroIntro />
        </ErrorBoundary>
        <ErrorBoundary {...boundary(dict.errors.live)}>
          <LiveTelevisionDeck />
        </ErrorBoundary>
        <ErrorBoundary {...boundary(dict.errors.experience)}>
          <RockExperienceSection />
        </ErrorBoundary>
        <ErrorBoundary {...boundary(dict.errors.discover)}>
          <MusicDiscoverySection />
        </ErrorBoundary>
        <ErrorBoundary {...boundary(dict.errors.legends)}>
          <RockLegendsSection />
        </ErrorBoundary>
      </main>

      <ErrorBoundary {...boundary(dict.errors.footer)}>
        <FinalExperienceFooter />
      </ErrorBoundary>

      <MobileTabBar />
      <LegendVideoModal />
      <MotionPrompt />
    </div>
  );
}
