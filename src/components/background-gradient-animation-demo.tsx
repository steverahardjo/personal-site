import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="#a41c1a"
      gradientBackgroundEnd="#c7362f"
      firstColor="199, 54, 47"
      secondColor="252, 249, 248"
      thirdColor="246, 243, 242"
      fourthColor="28, 27, 27"
      fifthColor="164, 28, 26"
      pointerColor="199, 54, 47"
      size="85%"
      blendingValue="soft-light"
      containerClassName="!relative !h-[210px] sm:!h-[240px] !w-full !overflow-hidden !rounded-[14px] !border !border-[color:var(--border)] !shadow-[0_12px_52px_var(--ambient-shadow)] [&_.animate-first]:[animation-duration:7s] [&_.animate-second]:[animation-duration:8s] [&_.animate-third]:[animation-duration:9s] [&_.animate-fourth]:[animation-duration:8s] [&_.animate-fifth]:[animation-duration:10s]"
      interactive
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(252,249,248,0.18),transparent_35%)]" />
    </BackgroundGradientAnimation>
  );
}
