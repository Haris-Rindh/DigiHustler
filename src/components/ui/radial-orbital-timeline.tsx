"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link as LinkIcon, Zap, Code, Palette, Cpu, TrendingUp, Shield, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  colorDark: string;
  colorLight: string;
  bgDark: string;
  bgLight: string;
  borderDark: string;
  borderLight: string;
  glowColor: string;
}

export const defaultServicesTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Web Engineering",
    date: "Core Squad",
    content: "Full-stack web applications, custom React/Next.js architectures, REST APIs, and scalable cloud databases.",
    category: "Engineering",
    icon: Code,
    relatedIds: [2, 3, 5],
    status: "completed",
    energy: 98,
    colorDark: "#22D3EE", // Electric Cyan
    colorLight: "#0891B2",
    bgDark: "rgba(6, 182, 212, 0.22)",
    bgLight: "rgba(6, 182, 212, 0.12)",
    borderDark: "rgba(34, 211, 238, 0.60)",
    borderLight: "rgba(8, 145, 178, 0.45)",
    glowColor: "rgba(34, 211, 238, 0.35)",
  },
  {
    id: 2,
    title: "Design Systems",
    date: "UI/UX & Brand",
    content: "Comprehensive brand identities, responsive Figma component libraries, 3D assets, and interactive user interfaces.",
    category: "Design",
    icon: Palette,
    relatedIds: [1, 4],
    status: "completed",
    energy: 94,
    colorDark: "#C084FC", // Vibrant Violet / Fuchsia
    colorLight: "#9333EA",
    bgDark: "rgba(168, 85, 247, 0.22)",
    bgLight: "rgba(168, 85, 247, 0.12)",
    borderDark: "rgba(192, 132, 252, 0.60)",
    borderLight: "rgba(147, 51, 234, 0.45)",
    glowColor: "rgba(192, 132, 252, 0.35)",
  },
  {
    id: 3,
    title: "AI Automations",
    date: "Intelligent Workflows",
    content: "Custom OpenAI assistants, autonomous customer bots, n8n/Zapier integration, and automated scraping pipelines.",
    category: "AI & Data",
    icon: Cpu,
    relatedIds: [1, 6],
    status: "completed",
    energy: 96,
    colorDark: "#34D399", // Emerald Mint Green
    colorLight: "#059669",
    bgDark: "rgba(16, 185, 129, 0.22)",
    bgLight: "rgba(16, 185, 129, 0.12)",
    borderDark: "rgba(52, 211, 153, 0.60)",
    borderLight: "rgba(5, 150, 105, 0.45)",
    glowColor: "rgba(52, 211, 153, 0.35)",
  },
  {
    id: 4,
    title: "Growth Marketing",
    date: "Performance SEO",
    content: "Data-driven SEO audits, high-converting PPC campaigns, content distribution, and B2B cold email infrastructure.",
    category: "Marketing",
    icon: TrendingUp,
    relatedIds: [2, 6],
    status: "completed",
    energy: 91,
    colorDark: "#FBBF24", // Golden Amber Sun
    colorLight: "#D97706",
    bgDark: "rgba(245, 158, 11, 0.22)",
    bgLight: "rgba(245, 158, 11, 0.12)",
    borderDark: "rgba(251, 191, 36, 0.60)",
    borderLight: "rgba(217, 119, 6, 0.45)",
    glowColor: "rgba(251, 191, 36, 0.35)",
  },
  {
    id: 5,
    title: "Cybersecurity",
    date: "SecOps & Audit",
    content: "Web penetration testing, OWASP Top 10 vulnerability remediation, API security hardening, and compliance advisory.",
    category: "Security",
    icon: Shield,
    relatedIds: [1],
    status: "completed",
    energy: 95,
    colorDark: "#FB7185", // Crimson Rose / Coral
    colorLight: "#E11D48",
    bgDark: "rgba(244, 63, 94, 0.22)",
    bgLight: "rgba(244, 63, 94, 0.12)",
    borderDark: "rgba(251, 113, 133, 0.60)",
    borderLight: "rgba(225, 29, 72, 0.45)",
    glowColor: "rgba(251, 113, 133, 0.35)",
  },
  {
    id: 6,
    title: "BI Dashboards",
    date: "Data Intelligence",
    content: "Executive PowerBI consoles, automated reporting pipelines, SQL analytics, and real-time operational insights.",
    category: "Analytics",
    icon: Database,
    relatedIds: [3, 4],
    status: "completed",
    energy: 92,
    colorDark: "#818CF8", // Royal Indigo Blue
    colorLight: "#4F46E5",
    bgDark: "rgba(99, 102, 241, 0.22)",
    bgLight: "rgba(99, 102, 241, 0.12)",
    borderDark: "rgba(129, 140, 248, 0.60)",
    borderLight: "rgba(79, 70, 229, 0.45)",
    glowColor: "rgba(129, 140, 248, 0.35)",
  },
];

interface RadialOrbitalTimelineProps {
  timelineData?: TimelineItem[];
  className?: string;
  embedded?: boolean;
}

export default function RadialOrbitalTimeline({
  timelineData = defaultServicesTimelineData,
  className = "",
  embedded = false,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isLight, setIsLight] = useState<boolean>(false);
  const [isAnimatingRotation, setIsAnimatingRotation] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const checkTheme = () => {
      const light =
        document.documentElement.getAttribute("data-theme") === "light" ||
        document.documentElement.classList.contains("light");
      setIsLight(light);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => observer.disconnect();
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  // Smoothly rotate the selected node to the top (apex)
  const animateRotationToNode = (index: number, totalNodes: number, onComplete?: () => void) => {
    setIsAnimatingRotation(true);
    const targetDeg = -90 - index * (360 / totalNodes);

    let currentDeg = rotationAngle;
    let diff = (targetDeg - currentDeg) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const startAngle = currentDeg;
    const finalAngle = currentDeg + diff;
    const duration = 450;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setRotationAngle(startAngle + diff * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setRotationAngle(finalAngle % 360);
        setIsAnimatingRotation(false);
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(step);
  };

  const toggleItem = (id: number) => {
    const isAlreadyOpen = expandedItems[id];

    if (isAlreadyOpen) {
      // Close and resume
      setExpandedItems({});
      setActiveNodeId(null);
      setAutoRotate(true);
      return;
    }

    // Stop auto-rotate immediately
    setAutoRotate(false);

    // Find node index
    const nodeIndex = timelineData.findIndex((item) => item.id === id);
    if (nodeIndex !== -1) {
      // First rotate the node to the top, then open the card
      animateRotationToNode(nodeIndex, timelineData.length, () => {
        setExpandedItems({ [id]: true });
        setActiveNodeId(id);
        setPulseEffect({ [id]: true });
        setTimeout(() => {
          setPulseEffect((prev) => ({ ...prev, [id]: false }));
        }, 600);
      });
    } else {
      setExpandedItems({ [id]: true });
      setActiveNodeId(id);
    }
  };

  useEffect(() => {
    if (!autoRotate || isAnimatingRotation) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.35) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate, isAnimatingRotation]);

  const calculateNodePosition = (index: number, totalNodes: number) => {
    const angleStep = (2 * Math.PI) / totalNodes;
    const currentAngle = angleStep * index + (rotationAngle * Math.PI) / 180;
    const radius = embedded ? 145 : 185;
    const x = radius * Math.cos(currentAngle);
    const y = radius * Math.sin(currentAngle);
    const zIndex = Math.round(100 + 50 * Math.sin(currentAngle));
    const opacity = 0.85 + 0.15 * Math.sin(currentAngle);

    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (nodeId: number) => {
    if (!activeNodeId) return false;
    const activeItem = timelineData.find((item) => item.id === activeNodeId);
    return activeItem?.relatedIds.includes(nodeId) || false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex items-center justify-center select-none ${
        embedded ? "h-[450px] sm:h-[490px]" : "h-[540px] sm:h-[620px]"
      } ${className}`}
      onClick={handleContainerClick}
      aria-label="Interactive Radial Orbital Timeline for DigiHust Capabilities"
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Central Hub Core */}
          <div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2] border-2 border-[var(--border-subtle)] shadow-xl flex items-center justify-center z-10 cursor-pointer transition-transform hover:scale-105"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Click to pause rotation" : "Click to auto-rotate"}
          >
            <div className="w-9 h-9 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-heading)] font-extrabold text-[10px] tracking-tight shadow-inner">
              DIGI
            </div>
          </div>

          {/* Primary Orbit Rings */}
          <div
            className={`absolute rounded-full border pointer-events-none transition-colors ${
              embedded ? "w-[290px] h-[290px]" : "w-[370px] h-[370px]"
            }`}
            style={{ borderColor: "var(--orbit-ring)" }}
          />
          <div
            className={`absolute rounded-full border border-dashed pointer-events-none transition-colors ${
              embedded ? "w-[325px] h-[325px]" : "w-[410px] h-[410px]"
            }`}
            style={{ borderColor: "var(--orbit-ring-dashed)" }}
          />

          {/* Orbit Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const Icon = item.icon;

            const iconColor = isLight ? item.colorLight : item.colorDark;
            const nodeBg = isExpanded
              ? iconColor
              : isRelated
              ? (isLight ? item.bgLight : item.bgDark)
              : (isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(7, 53, 71, 0.95)");
            const nodeBorder = isExpanded
              ? (isLight ? item.colorLight : "#FFFFFF")
              : isRelated
              ? (isLight ? item.borderLight : item.borderDark)
              : (isLight ? item.borderLight : item.borderDark);

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                tabIndex={0}
                role="button"
                aria-label={`${item.title} capability node - ${item.energy}%`}
                aria-expanded={isExpanded}
                className="absolute transition-all duration-300 cursor-pointer focus:outline-none rounded-2xl group"
                style={nodeStyle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(item.id);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Node Icon Circle with Individual Color Signature */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 transform ${
                    isExpanded ? "scale-120 shadow-2xl" : "hover:scale-110"
                  }`}
                  style={{
                    backgroundColor: nodeBg,
                    borderWidth: "1.5px",
                    borderStyle: "solid",
                    borderColor: nodeBorder,
                    color: isExpanded ? "#FFFFFF" : iconColor,
                    boxShadow: isExpanded
                      ? `0 0 25px ${item.glowColor}`
                      : `0 4px 15px ${item.glowColor}`,
                  }}
                >
                  <Icon size={20} style={{ color: isExpanded ? "#FFFFFF" : iconColor }} strokeWidth={2.2} />
                </div>

                {/* Node Title Label */}
                <div
                  className={`absolute top-13 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold tracking-tight px-2.5 py-0.5 rounded-lg transition-all duration-300 shadow-sm ${
                    isExpanded
                      ? "text-white scale-105 font-black"
                      : "text-[var(--text-heading)] bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)]"
                  }`}
                  style={{
                    backgroundColor: isExpanded ? iconColor : undefined,
                  }}
                >
                  {item.title}
                </div>

                {/* Expanded Details Card anchored at the apex */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-[var(--bg-surface)] border-2 shadow-2xl z-[300] overflow-visible text-[var(--text-heading)] animate-in fade-in zoom-in-95 duration-200"
                    style={{ borderColor: iconColor }}
                  >
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3"
                      style={{ backgroundColor: iconColor }}
                    />
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex justify-between items-center">
                        <Badge
                          className="px-2.5 py-0.5 text-[10px] font-bold border"
                          style={{
                            backgroundColor: isLight ? item.bgLight : item.bgDark,
                            borderColor: isLight ? item.borderLight : item.borderDark,
                            color: iconColor,
                          }}
                        >
                          {item.category.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm font-extrabold text-[var(--text-heading)] mt-1.5 flex items-center gap-1.5">
                        <Icon size={16} style={{ color: iconColor }} />
                        <span>{item.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-[var(--text-body)] px-4 pb-4">
                      <p className="leading-relaxed">{item.content}</p>

                      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                        <div className="flex justify-between items-center text-[10px] mb-1 font-bold text-[var(--text-muted)]">
                          <span className="flex items-center text-[var(--text-heading)]">
                            <Zap size={11} className="mr-1" style={{ color: iconColor }} />
                            Squad Capability Level
                          </span>
                          <span className="font-mono text-[var(--text-heading)]">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.energy}%`,
                              backgroundColor: iconColor,
                            }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                          <div className="flex items-center mb-1.5">
                            <LinkIcon size={10} className="text-[var(--text-muted)] mr-1" />
                            <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--text-muted)]">
                              Connected Squads
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-[10px] rounded-lg border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-heading)] transition-all font-semibold cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-[var(--text-muted)]" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
