"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, motion } from "framer-motion";

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 1.5,
  decimals = 0,
  separator = false,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  separator?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;

      let formatted: string;
      if (decimals > 0) {
        formatted = current.toFixed(decimals);
      } else {
        formatted = Math.round(current).toString();
      }

      if (separator) {
        const parts = formatted.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        formatted = parts.join(".");
      }

      setDisplay(formatted);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, end, duration, decimals, separator]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export function AnimatedBar({
  percentage,
  color,
  className = "",
  delay = 0,
}: {
  percentage: number;
  color?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`h-full rounded-full ${className}`}
      style={color ? { background: color } : undefined}
      initial={{ width: "0%" }}
      whileInView={{ width: `${percentage}%` }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" as const }}
    />
  );
}

export function AnimatedBarVertical({
  height,
  className = "",
  delay = 0,
}: {
  height: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ height: "0%" }}
      whileInView={{ height }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" as const }}
    />
  );
}
