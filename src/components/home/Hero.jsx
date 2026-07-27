import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 90]);

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-primary" />
            {t("mission")}
          </span>
          <h1 className="mt-6 text-[2.75rem] sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1] break-words">
            <span className="inline-block">Recycle</span>
            <span className="inline-block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Connect
            </span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-lg">{t("tagline")}</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 [&>a]:whitespace-nowrap">
            <Link
              to="/assistant"
              className="h-16 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg inline-flex items-center justify-center gap-2 soft-shadow hover:brightness-110 active:scale-[0.98] transition"
            >
              {t("getStarted")} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/finder"
              className="h-16 px-8 rounded-full glass font-semibold text-lg inline-flex items-center justify-center gap-2 hover:bg-primary/10 active:scale-[0.98] transition"
            >
              <MapPin className="w-5 h-5 text-accent" /> {t("findCentres")}
            </Link>
          </div>
        </motion.div>

        <motion.div style={{ y }} className="relative">
          <div className="absolute -inset-8 rounded-[48px] bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="relative animate-float">
            <Image
              src="https://media.base44.com/images/public/6a67017a886f99eed0748a3d/6450fd8d9_generated_9dab6243.png"
              alt="3D illustration of Earth surrounded by floating recycling symbols and leaves"
              className="w-full aspect-square orbital"
              fittingType="fit"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}