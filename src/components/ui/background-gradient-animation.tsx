"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const curRef = useRef({ x: 0, y: 0 });
  const tgRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    function animate() {
      if (!interactiveRef.current) return;
      curRef.current.x += (tgRef.current.x - curRef.current.x) / 20;
      curRef.current.y += (tgRef.current.y - curRef.current.y) / 20;
      interactiveRef.current.style.transform = `translate(${Math.round(curRef.current.x)}px, ${Math.round(curRef.current.y)}px)`;
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [interactive]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      tgRef.current.x = event.clientX - rect.left;
      tgRef.current.y = event.clientY - rect.top;
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div className={cn("gradients-container h-full w-full blur-lg", isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]")}>
        {[
          { color: "var(--first-color)", anim: "animate-first", origin: "center center" },
          { color: "rgba(var(--second-color),0.8)", anim: "animate-second", origin: "calc(50%-400px)" },
          { color: "rgba(var(--third-color),0.8)", anim: "animate-third", origin: "calc(50%+400px)" },
          { color: "rgba(var(--fourth-color),0.8)", anim: "animate-fourth", origin: "calc(50%-200px)", opacity: "70" },
          { color: "rgba(var(--fifth-color),0.8)", anim: "animate-fifth", origin: "calc(50%-800px) calc(50%+800px)" },
        ].map((g, i) => (
          <div key={i}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,${g.color}_0,${g.color}_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
              `[transform-origin:${g.origin}]`,
              g.anim,
              `opacity-${g.opacity || "100"}`
            )}
          />
        ))}
        {interactive && (
          <div ref={interactiveRef} onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2 opacity-70`
            )}
          />
        )}
      </div>
    </div>
  );
};
