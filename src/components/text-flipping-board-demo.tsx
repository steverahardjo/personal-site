"use client";
import React from "react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";

const NAME_TEXT = "STEVE RAHARDJO";

export default function TextFlippingBoardDemo() {
  return (
    // 1. Reduced max-w from 560px to 400px (or smaller)
    <div className="w-full max-w-[400px]">
      <TextFlippingBoard
        text={NAME_TEXT}
        duration={1.1}
        // 2. Reduced padding (p-1.5 -> p-1)
        // 3. Added text-sm to shrink the font inside the boards
        className="border border-[color:var(--border)] bg-[color:var(--bg)] p-1 shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-sm"
      />
    </div>
  );
}
