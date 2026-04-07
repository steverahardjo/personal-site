"use client";
import React from "react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";

const NAME_TEXT = "STEVE RAHARDJO";

export default function TextFlippingBoardDemo() {
  return (
    <div className="w-full max-w-[560px]">
      <TextFlippingBoard
        text={NAME_TEXT}
        duration={1.1}
        className="border border-[color:var(--border)] bg-[color:var(--bg)] p-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.18)] md:p-2"
      />
    </div>
  );
}
