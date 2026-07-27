import React from "react";
import Reveal from "@/components/common/Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignCls = align === "left" ? "text-left mx-0" : "text-center mx-auto";
  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">{eyebrow}</p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground text-lg">{subtitle}</p>}
    </Reveal>
  );
}