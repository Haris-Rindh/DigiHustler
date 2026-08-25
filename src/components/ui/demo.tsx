"use client";
import React from "react";
import RadialOrbitalTimeline, { defaultServicesTimelineData } from "@/components/ui/radial-orbital-timeline";

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="w-full bg-[var(--color-bg)] py-12 flex flex-col items-center justify-center">
      <RadialOrbitalTimeline timelineData={defaultServicesTimelineData} embedded={true} />
    </div>
  );
}

export default {
  RadialOrbitalTimelineDemo,
};
