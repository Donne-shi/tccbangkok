import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Hook: returns true once the element scrolls into view */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/** Wrapper component with scroll-triggered animation */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}) {
  const { ref, visible } = useScrollReveal(0.1);

  const baseStyles: React.CSSProperties = {
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.7s',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
  };

  const hiddenTransform = {
    up: 'translateY(40px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
    scale: 'scale(0.9)',
  };

  const style: React.CSSProperties = visible
    ? { ...baseStyles, opacity: 1, transform: 'translateY(0) translateX(0) scale(1)' }
    : { ...baseStyles, opacity: 0, transform: hiddenTransform[direction] };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

/** Animated counter */
export function useCountUp(target: number, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnVisible) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, startOnVisible]);

  return { count, ref };
}
