import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Hero ---------------- */
const PrismaHero = () => {
  const navigate = useNavigate();

  return (
    <section className="h-screen w-full p-2 md:p-4 bg-black">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem] flex flex-col justify-between items-center text-center p-6 md:p-10">

        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

        {/* TOP CENTER Content: Title & Full Description — comfortable spacing from top */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl" style={{ paddingTop: "8vh" }}>
          <h1
            className="font-medium leading-[0.85] tracking-[-0.07em] text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] xl:text-[11vw]"
            style={{ color: "#E1E0CC" }}
          >
            <WordsPullUp text="DayMark" showAsterisk />
          </h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg font-medium drop-shadow-md max-w-2xl px-2"
            style={{ lineHeight: 1.4, color: "#ffffff" }}
          >
            DayMark is a student wellness &amp; productivity ecosystem bound not by status or labels, but by passion and drive to balance study goals, habits, focus sessions, and physical well-being.
          </motion.p>
        </div>

        {/* BOTTOM CENTER Content: CTA Button — comfortable spacing from bottom */}
        <div className="relative z-10" style={{ paddingBottom: "10vh" }}>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-3 rounded-full bg-[#E1E0CC] py-3.5 pl-8 pr-3.5 text-base font-normal text-black/90 transition-all hover:bg-white hover:scale-105 sm:text-lg cursor-pointer shadow-2xl tracking-[-0.01em]"
          >
            <span>Explore DayMark</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:translate-x-1 sm:h-10 sm:w-10 flex-shrink-0">
              <ChevronRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
            </span>
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export { PrismaHero };
