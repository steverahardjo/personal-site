import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="#2a0d0c"
      gradientBackgroundEnd="#0f0f0f"
      firstColor="199, 54, 47"
      secondColor="156, 43, 37"
      thirdColor="255, 255, 255"
      fourthColor="8, 8, 8"
      fifthColor="199, 54, 47"
      pointerColor="199, 54, 47"
      size="85%"
      blendingValue="hard-light"
      containerClassName="!relative !h-[210px] sm:!h-[240px] !w-full !overflow-hidden !rounded-[14px] !border !border-red-500/35 !shadow-[0_14px_38px_rgba(0,0,0,0.28)] [&_.animate-first]:[animation-duration:6s] [&_.animate-second]:[animation-duration:7s] [&_.animate-third]:[animation-duration:8s] [&_.animate-fourth]:[animation-duration:7s] [&_.animate-fifth]:[animation-duration:9s]"
      interactive
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,230,0.18),transparent_35%)]" />
    </BackgroundGradientAnimation>
  );
}
