import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import ScanPanel from "@/components/assistant/ScanPanel";
import ChatPanel from "@/components/assistant/ChatPanel";

export default function Assistant() {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-10">
      <SectionHeading
        eyebrow="AI Eco Assistant"
        title="Not sure? Just ask or scan"
        subtitle="Identify any item from a photo, or chat with the assistant for instant Malaysian recycling advice."
      />
      <div className="mt-14 grid lg:grid-cols-2 gap-6 items-start">
        <Reveal><ScanPanel /></Reveal>
        <Reveal delay={0.1}><ChatPanel /></Reveal>
      </div>
    </div>
  );
}